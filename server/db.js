// db.js
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const fileUpload = require('express-fileupload'); // Removed: Middleware should be initialized in server.js

module.exports = (app, db) => {
  const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_production";
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "12h";
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

  const issueToken = (user) =>
    jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || "admin",
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

  const getBearerToken = (req) => {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) return null;
    return header.slice(7).trim();
  };

  const authenticateAdmin = (req, res, next) => {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: token missing" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
  };

  const adminProtectedRoutePatterns = [
    { method: "POST", regex: /^\/add-(category|subcategory|Services|casestudy|blog|faq)$/ },
    { method: "PUT", regex: /^\/update-(category|subcategory|Services|casestudy|blog|faq)\/[^/]+$/ },
    { method: "DELETE", regex: /^\/delete-(category|subcategory|Services|casestudy|blog|faq)\/[^/]+$/ },
    { method: "POST", regex: /^\/upload-section-image$/ },
    { method: "POST", regex: /^\/api\/upload-base64-image$/ },
    { method: "GET", regex: /^\/users$/ },
  ];

  const isAdminProtected = (req) => {
    const method = (req.method || "").toUpperCase();
    const normalizedPath = (req.path || "").replace(/^\/api\/v1/, "");
    return adminProtectedRoutePatterns.some(
      (route) => route.method === method && route.regex.test(normalizedPath)
    );
  };

  app.use((req, res, next) => {
    if (!isAdminProtected(req)) {
      return next();
    }
    return authenticateAdmin(req, res, next);
  });

  app.post("/login", (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (ADMIN_EMAIL && ADMIN_PASSWORD && email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const user = { id: 0, email: ADMIN_EMAIL, role: "admin", name: "Admin" };
      const token = issueToken(user);
      return res.status(200).json({
        message: "Login successful",
        token,
        user,
      });
    }

    const sql = "SELECT id, email, password, role, name FROM users WHERE email = ? LIMIT 1";
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error("Login query error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!results || results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const dbUser = results[0];
      const storedPassword = dbUser.password || "";
      let passwordMatches = false;

      try {
        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
          passwordMatches = await bcrypt.compare(password, storedPassword);
        } else {
          passwordMatches = password === storedPassword;
        }
      } catch (compareError) {
        console.error("Password comparison error:", compareError);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!passwordMatches) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const role = dbUser.role || "admin";
      if (role !== "admin") {
        return res.status(403).json({ message: "Forbidden: admin access required" });
      }

      const user = {
        id: dbUser.id,
        email: dbUser.email,
        role,
        name: dbUser.name || "Admin",
      };
      const token = issueToken(user);

      return res.status(200).json({
        message: "Login successful",
        token,
        user,
      });
    });
  });

  // Directories for file uploads (ensure these match server.js or are consistent)
  const sectionsDir = path.join(__dirname, '..', 'public', 'uploads', 'sections');
  const caseStudiesDir = path.join(__dirname, '..', 'public', 'uploads', 'case_studies'); // New directory for case studies
  const blogsDir = path.join(__dirname, '..', 'public', 'uploads', 'blogs'); // New directory for blogs

  if (!fs.existsSync(sectionsDir)) {
    fs.mkdirSync(sectionsDir, { recursive: true });
    console.log(`[DB Setup] Created directory: ${sectionsDir}`);
  }

  if (!fs.existsSync(caseStudiesDir)) {
    fs.mkdirSync(caseStudiesDir, { recursive: true });
    console.log(`[DB Setup] Created directory: ${caseStudiesDir}`);
  }

  if (!fs.existsSync(blogsDir)) { // Ensure blogs directory is created
    fs.mkdirSync(blogsDir, { recursive: true });
    console.log(`[DB Setup] Created directory: ${blogsDir}`);
  }

  // Middleware for file uploads is handled in server.js now.
  // app.use(fileUpload({ // Removed
  //   createParentPath: true,
  //   limits: { fileSize: 50 * 1024 * 1024 }
  // }));


  // CATEGORY API ENDPOINTS

  // Add a new category
  app.post('/add-category', (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    const sql = 'INSERT INTO category (name) VALUES (?)';
    db.query(sql, [name], (err, result) => {
      if (err) {
        console.error("Error inserting category:", err);
        return res.status(500).json({ message: 'Error inserting category' });
      }
      res.status(200).json({ message: 'Category added successfully', id: result.insertId });
    });
  });

  // Get all categories
  app.get('/categories', (req, res) => {
    const sql = 'SELECT * FROM category ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching categories:", err);
        return res.status(500).json({ message: 'Error retrieving categories' });
      }
      res.status(200).json(results);
    });
  });

  // Update an existing category by ID
  app.put("/update-category/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    const query = "UPDATE category SET name = ? WHERE id = ?";
    db.query(query, [name, id], (err) => {
      if (err) {
        console.error('Error updating category:', err);
        return res.status(500).json({ message: "Error updating category" });
      }
      res.json({ message: "Category updated successfully" });
    });
  });

  // Delete a category by ID
  app.delete("/delete-category/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM category WHERE id = ?";
    db.query(query, [id], (err) => {
      if (err) {
        console.error('Error deleting category:', err);
        return res.status(500).json({ message: "Error deleting category" });
      }
      res.json({ message: "Category deleted successfully" });
    });
  });

  // SUBCATEGORY API ENDPOINTS

  // Add a new subcategory
  app.post('/add-subcategory', (req, res) => {
    const { category_id, name } = req.body;
    if (!category_id || !name) {
      return res.status(400).json({ message: 'Category ID and Subcategory name are required' });
    }
    const sql = 'INSERT INTO subcategories (category_id, name) VALUES (?, ?)';
    db.query(sql, [category_id, name], (err, result) => {
      if (err) {
        console.error('Error inserting subcategory:', err);
        return res.status(500).json({ message: 'Error inserting subcategory' });
      }
      res.status(200).json({ message: 'Subcategory added successfully', id: result.insertId });
    });
  });

  // Get subcategories (optionally filtered by category_id)
  app.get('/subcategories', (req, res) => {
    const { category_id } = req.query;
    let sql, params = [];

    if (category_id) {
      sql = `
        SELECT s.id, s.name, s.category_id, c.name as category_name
        FROM subcategories s
        JOIN category c ON s.category_id = c.id
        WHERE s.category_id = ?
        ORDER BY s.created_at DESC
      `;
      params = [category_id];
    } else {
      sql = `
        SELECT s.id, s.name, s.category_id, c.name as category_name
        FROM subcategories s
        JOIN category c ON s.category_id = c.id
        ORDER BY s.created_at DESC
      `;
    }

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('Error fetching subcategories:', err);
        return res.status(500).json({ message: 'Error retrieving subcategories' });
      }
      res.status(200).json(results);
    });
  });

  // Update an existing subcategory by ID
  app.put('/update-subcategory/:id', (req, res) => {
    const { id } = req.params;
    const { category_id, name } = req.body;
    if (!category_id || !name) {
      return res.status(400).json({ message: 'Category ID and Subcategory name are required' });
    }
    const sql = 'UPDATE subcategories SET category_id = ?, name = ? WHERE id = ?';
    db.query(sql, [category_id, name, id], (err) => {
      if (err) {
        console.error('Error updating subcategory:', err);
        return res.status(500).json({ message: 'Error updating subcategory' });
      }
      res.status(200).json({ message: 'Subcategory updated successfully' });
    });
  });

  // Delete a subcategory by ID
  app.delete('/delete-subcategory/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM subcategories WHERE id = ?';
    db.query(sql, [id], (err) => {
      if (err) {
        console.error('Error deleting subcategory:', err);
        return res.status(500).json({ message: 'Error deleting subcategory' });
      }
      res.status(200).json({ message: 'Subcategory deleted successfully' });
    });
  });

  // SUB-SUBCATEGORY API ENDPOINTS

  // Add a new sub-subcategory
  app.post('/add-Services', (req, res) => {
    const {
      category_id,
      subcategory_id,
      name,
      templateKey,
      title,
      description,
      meta_description,
      meta_keywords,
      sections
    } = req.body;

    if (!category_id || !subcategory_id || !name) {
      return res.status(400).json({ message: 'Category ID, Subcategory ID and Name are required' });
    }

    let sectionsData = [];

    if (sections && Array.isArray(sections)) {
      sectionsData = sections.map(section => ({
        title: section.title || '',
        description: section.description || '',
        image: section.image || ''
      }));

      console.log('Processed sections for adding:', sectionsData);
    }

    // Convert to JSON string for storage
    const sectionsJson = JSON.stringify(sectionsData);

    const sql = `INSERT INTO subsubcategories
      (category_id, subcategory_id, name, templateKey , title, description, meta_description, meta_keywords, sections)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
      category_id,
      subcategory_id,
      name,
      templateKey,
      title || null,
      description || null,
      meta_description || null,
      meta_keywords || null,
      sectionsJson // Store as JSON string
    ], (err, result) => {
      if (err) {
        console.error('Error inserting sub-sub-category:', err);
        return res.status(500).json({ message: 'Error inserting sub-sub-category' });
      }
      res.status(200).json({
        message: 'Sub-sub-category added successfully',
        id: result.insertId
      });
    });
  });

  // Get all Services
  app.get('/subsubcategories', (req, res) => {
    const sql = `
      SELECT ssc.id, ssc.name, ssc.templateKey, ssc.category_id, ssc.subcategory_id,
             ssc.description, ssc.title, ssc.created_at, ssc.meta_keywords, ssc.meta_description,
             c.name AS category_name,
             sc.name AS subcategory_name
      FROM subsubcategories ssc
      LEFT JOIN category c ON ssc.category_id = c.id
      LEFT JOIN subcategories sc ON ssc.subcategory_id = sc.id
      ORDER BY ssc.created_at DESC
    `;
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching sub-sub-categories:', err);
        return res.status(500).json({ message: 'Error retrieving sub-sub-categories' });
      }
      res.status(200).json(results);
    });
  });

  // Get a specific sub-subcategory by ID
  app.get('/subsubcategories/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
      SELECT ssc.*,
             c.name AS category_name,
             sc.name AS subcategory_name
      FROM subsubcategories ssc
      LEFT JOIN category c ON ssc.category_id = c.id
      LEFT JOIN subcategories sc ON ssc.subcategory_id = sc.id
      WHERE ssc.id = ?
    `;

    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error fetching sub-sub-category:', err);
        return res.status(500).json({ message: 'Error retrieving sub-sub-category' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Sub-sub-category not found' });
      }

      const result = results[0];

      // Parse sections JSON if it exists
      if (result.sections && typeof result.sections === 'string') {
        try {
          result.sections = JSON.parse(result.sections);
        } catch (e) {
          console.error('Error parsing sections:', e);
          result.sections = [];
        }
      } else {
        result.sections = [];
      }

      res.status(200).json(result);
    });
  });

  // Update an existing sub-subcategory by ID
  app.put('/update-Services/:id', (req, res) => {
    const { id } = req.params;
    const {
      category_id,
      subcategory_id,
      name,
      templateKey,
      title,
      description,
      meta_description,
      meta_keywords,
      sections
    } = req.body;

    console.log('Update request body:', req.body);

    if (!category_id || !subcategory_id || !name) {
      return res.status(400).json({ message: 'Category ID, Subcategory ID and Name are required' });
    }

    // Process sections data
    let processedSections = [];

    try {
      // Check if sections is already an array
      if (Array.isArray(sections)) {
        processedSections = [...sections];
      }
      // Check if sections is a JSON string
      else if (typeof sections === 'string') {
        // Try to parse if it looks like JSON
        if (sections.trim().startsWith('[')) {
          processedSections = JSON.parse(sections);
        }
        // If it's a string but not JSON format, create a default section
        else if (sections.trim()) {
          processedSections = [{ title: 'Section', description: sections }];
        }
      }

      // Process each section with images
      for (let i = 0; i < processedSections.length; i++) {
        const section = processedSections[i] || {};

        // Ensure section has required fields
        processedSections[i] = {
          title: section.title || '',
          description: section.description || '',
          image: section.image || ''
        };

        // Handle base64 image data
        if (section.image && typeof section.image === 'string' && section.image.startsWith('data:image')) {
          try {
            // Ensure directory exists
            if (!fs.existsSync(sectionsDir)) {
              fs.mkdirSync(sectionsDir, { recursive: true });
            }

            // Extract image data and type
            const matches = section.image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);

            if (matches && matches.length === 3) {
              const imageType = matches[1];
              const base64Data = matches[2];
              const buffer = Buffer.from(base64Data, 'base64');

              // Generate unique filename
              const filename = `section_${id}_${i}_${Date.now()}.${imageType}`;
              const filepath = path.join(sectionsDir, filename);

              // Save the file
              fs.writeFileSync(filepath, buffer);

              // Update image path
              processedSections[i].image = `/uploads/sections/${filename}`;
              console.log(`Saved image for section ${i}: ${processedSections[i].image}`);
            }
          } catch (err) {
            console.error('Error processing image for section', i, ':', err);
          }
        }
      }
    } catch (error) {
      console.error('Error processing sections:', error);
      processedSections = [];
    }

    console.log('Final processed sections:', processedSections);

    // Convert sections to JSON string
    const sectionsJson = JSON.stringify(processedSections);

    const sql = `
      UPDATE subsubcategories
      SET
        category_id = ?,
        subcategory_id = ?,
        name = ?,
        templateKey = ?,
        title = ?,
        description = ?,
        meta_description = ?,
        meta_keywords = ?,
        sections = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [
        category_id,
        subcategory_id,
        name,
        templateKey,
        title || null,
        description || null,
        meta_description || null,
        meta_keywords || null,
        sectionsJson,
        id
      ],
      (err, result) => {
        if (err) {
          console.error('Error updating sub-sub-category:', err);
          return res.status(500).json({
            message: 'Error updating sub-sub-category',
            error: err.message
          });
        }

        // Return the updated record
        const selectSql = `
          SELECT ssc.*,
            c.name AS category_name,
            sc.name AS subcategory_name
          FROM subsubcategories ssc
          LEFT JOIN category c ON ssc.category_id = c.id
          LEFT JOIN subcategories sc ON ssc.subcategory_id = sc.id
          WHERE ssc.id = ?
        `;

        db.query(selectSql, [id], (selectErr, selectResult) => {
          if (selectErr) {
            console.error('Error fetching updated record:', selectErr);
            return res.status(200).json({
              message: 'Sub-sub-category updated successfully',
              id: id
            });
          }

          const updatedRecord = selectResult[0];

          // Parse sections if they exist
          if (updatedRecord.sections && typeof updatedRecord.sections === 'string') {
            try {
              updatedRecord.sections = JSON.parse(updatedRecord.sections);
            } catch (e) {
              console.error('Error parsing sections:', e);
              updatedRecord.sections = [];
            }
          } else {
            updatedRecord.sections = [];
          }

          res.status(200).json(updatedRecord);
        });
      }
    );
  });

  // Delete a sub-subcategory by ID
  app.delete('/delete-Services/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM subsubcategories WHERE id = ?';
    db.query(sql, [id], (err) => {
      if (err) {
        console.error('Error deleting sub-sub-category:', err);
        return res.status(500).json({ message: 'Error deleting sub-sub-category' });
      }
      res.status(200).json({ message: 'Sub-sub-category deleted successfully' });
    });
  });

  // CASE STUDIES API ENDPOINTS

  // Add a new case study
  app.post('/add-casestudy', (req, res) => {
    const { title, description, client_name, additional_details, category_id } = req.body;
    let image_url = null; // Initialize as null

    // Validate required fields
    if (!title || !description || !client_name || !category_id) {
      console.error('[ADD] Missing required fields for case study.');
      return res.status(400).json({ message: 'Title, description, client name, and category are required' });
    }

    // Function to insert case study into DB
    const insertCaseStudy = () => {
      console.log(`[ADD] Final image_url before DB insert: ${image_url}`); // Debug log
      const sql = `
        INSERT INTO case_studies (title, description, client_name, additional_details, category_id, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(sql, [title, description, client_name, additional_details, category_id, image_url], (err, result) => {
        if (err) {
          console.error('[ADD] Error inserting case study into DB:', err);
          return res.status(500).json({ message: 'Error inserting case study', error: err.message });
        }
        res.status(200).json({ message: 'Case Study added successfully', id: result.insertId, image_url: image_url });
      });
    };

    // Handle image upload if present
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      // Sanitize filename to prevent issues (e.g., spaces, special characters)
      const sanitizedFileName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `casestudy_${Date.now()}_${sanitizedFileName}`;
      const filepath = path.join(caseStudiesDir, filename);

      console.log(`[ADD] Attempting to move file: ${imageFile.name} to ${filepath}`); // Debug log
      imageFile.mv(filepath, (err) => {
        if (err) {
          console.error('[ADD] Error uploading case study image:', err);
          // If image upload fails, keep image_url as null, but still try to insert
          // You might want to return an error here if image upload is mandatory
          insertCaseStudy();
        } else {
          image_url = `/uploads/case_studies/${filename}`;
          console.log(`[ADD] Image uploaded successfully, image_url: ${image_url}`); // Debug log
          insertCaseStudy();
        }
      });
    } else {
      console.log('[ADD] No image provided for new case study. image_url will be NULL.'); // Debug log
      insertCaseStudy(); // Proceed directly if no image
    }
  });

  // Get all case studies
  app.get('/case-studies', (req, res) => {
    const sql = `
      SELECT cs.*, c.name as category_name
      FROM case_studies cs
      JOIN category c ON cs.category_id = c.id
      ORDER BY cs.created_at DESC
    `;
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching case studies:', err);
        return res.status(500).json({ message: 'Error retrieving case studies' });
      }
      res.status(200).json(results);
    });
  });

  // Get a specific case study by ID
  app.get('/case-studies/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
      SELECT cs.*, c.name as category_name
      FROM case_studies cs
      JOIN category c ON cs.category_id = c.id
      WHERE cs.id = ?
    `;
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error fetching case study:', err);
        return res.status(500).json({ message: 'Error retrieving case study' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Case Study not found' });
      }
      res.status(200).json(results[0]);
    });
  });

  // Update an existing case study by ID
  app.put('/update-casestudy/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, client_name, additional_details, category_id } = req.body;
    let image_url = (req.body.image_url === 'null' || req.body.image_url === '') ? null : req.body.image_url;

    if (!title || !description || !client_name || !category_id) {
      console.error('[UPDATE] Missing required fields for case study update.');
      return res.status(400).json({ message: 'Title, description, client name, and category are required' });
    }

    console.log(`[UPDATE] Initial image_url from request body: ${image_url}`); // Debug log

    const updateCaseStudyInDb = () => {
      console.log(`[UPDATE] Final image_url before DB update: ${image_url}`); // Debug log
      const sql = `
        UPDATE case_studies
        SET title = ?, description = ?, client_name = ?, additional_details = ?, category_id = ?, image_url = ?
        WHERE id = ?
      `;
      db.query(sql, [title, description, client_name, additional_details, category_id, image_url, id], (err) => {
        if (err) {
          console.error('[UPDATE] Error updating case study in DB:', err);
          return res.status(500).json({ message: 'Error updating case study', error: err.message });
        }
        res.status(200).json({ message: 'Case Study updated successfully', image_url: image_url });
      });
    };

    // Handle image upload if a new image is provided
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const sanitizedFileName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `casestudy_${Date.now()}_${sanitizedFileName}`;
      const filepath = path.join(caseStudiesDir, filename);

      console.log(`[UPDATE] Attempting to move new file: ${imageFile.name} to ${filepath}`); // Debug log
      imageFile.mv(filepath, (err) => {
        if (err) {
          console.error('[UPDATE] Error uploading new case study image:', err);
          // If upload fails, image_url remains the value it had before this if block (from req.body or null)
          updateCaseStudyInDb();
        } else {
          image_url = `/uploads/case_studies/${filename}`;
          console.log(`[UPDATE] New image uploaded successfully, image_url: ${image_url}`); // Debug log
          updateCaseStudyInDb();
        }
      });
    } else {
      console.log('[UPDATE] No new image provided for update. Using existing or null image_url.'); // Debug log
      updateCaseStudyInDb(); // Proceed directly if no new image
    }
  });

  // Delete a case study by ID
  app.delete('/delete-casestudy/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM case_studies WHERE id = ?';
    db.query(sql, [id], (err) => {
      if (err) {
        console.error('Error deleting case study:', err);
        return res.status(500).json({ message: 'Error deleting case study' });
      }
      res.status(200).json({ message: 'Case Study deleted successfully' });
    });
  });


  // BLOG API ENDPOINTS (NEW)

  // Add a new blog
  app.post('/add-blog', (req, res) => {
    // Added 'tags' to the destructuring
    const { title, short_description, content, category_id, tags } = req.body;
    let image_url = null; // Initialize as null

    // Validate required fields
    if (!title || !short_description || !content || !category_id) {
      console.error('[ADD BLOG] Missing required fields for blog.');
      return res.status(400).json({ message: 'Title, short description, content, and category are required' });
    }

    // Function to insert blog into DB
    const insertBlog = () => {
      console.log(`[ADD BLOG] Final image_url before DB insert: ${image_url}`); // Debug log
      // Added 'tags' to the SQL INSERT statement
      const sql = `
        INSERT INTO blogs (title, short_description, content, category_id, image_url, tags)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(sql, [title, short_description, content, category_id, image_url, tags || null], (err, result) => {
        if (err) {
          console.error('[ADD BLOG] Error inserting blog into DB:', err);
          return res.status(500).json({ message: 'Error inserting blog', error: err.message });
        }
        res.status(200).json({ message: 'Blog added successfully', id: result.insertId, image_url: image_url });
      });
    };

    // Handle image upload if present
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      // Sanitize filename to prevent issues (e.g., spaces, special characters)
      const sanitizedFileName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `blog_${Date.now()}_${sanitizedFileName}`; // Updated filename prefix
      const filepath = path.join(blogsDir, filename); // Updated directory

      console.log(`[ADD BLOG] Attempting to move file: ${imageFile.name} to ${filepath}`); // Debug log
      imageFile.mv(filepath, (err) => {
        if (err) {
          console.error('[ADD BLOG] Error uploading blog image:', err);
          // If image upload fails, keep image_url as null, but still try to insert
          insertBlog();
        } else {
          image_url = `/uploads/blogs/${filename}`; // Updated URL path
          console.log(`[ADD BLOG] Image uploaded successfully, image_url: ${image_url}`); // Debug log
          insertBlog();
        }
      });
    } else {
      console.log('[ADD BLOG] No image provided for new blog. image_url will be NULL.'); // Debug log
      insertBlog(); // Proceed directly if no image
    }
  });

  // Get all blogs
  app.get('/blogs', (req, res) => {
    const sql = `
      SELECT b.*, c.name as category_name
      FROM blogs b
      JOIN category c ON b.category_id = c.id
      ORDER BY b.created_at DESC
    `; // Updated table name and alias
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching blogs:', err);
        return res.status(500).json({ message: 'Error retrieving blogs' });
      }
      res.status(200).json(results);
    });
  });

  // Get a specific blog by ID
  app.get('/blogs/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
      SELECT b.*, c.name as category_name
      FROM blogs b
      JOIN category c ON b.category_id = c.id
      WHERE b.id = ?
    `; // Updated table name and alias
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error fetching blog:', err);
        return res.status(500).json({ message: 'Error retrieving blog' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      res.status(200).json(results[0]);
    });
  });

  // Update an existing blog by ID
  app.put('/update-blog/:id', (req, res) => {
    // Added 'tags' to the destructuring
    const { id } = req.params;
    const { title, short_description, content, category_id, tags } = req.body;
    let image_url = (req.body.image_url === 'null' || req.body.image_url === '') ? null : req.body.image_url;

    if (!title || !short_description || !content || !category_id) {
      console.error('[UPDATE BLOG] Missing required fields for blog update.');
      return res.status(400).json({ message: 'Title, short description, content, and category are required' });
    }

    console.log(`[UPDATE BLOG] Initial image_url from request body: ${image_url}`); // Debug log

    const updateBlogInDb = () => {
      console.log(`[UPDATE BLOG] Final image_url before DB update: ${image_url}`); // Debug log
      // Added 'tags' to the SQL UPDATE statement
      const sql = `
        UPDATE blogs
        SET title = ?, short_description = ?, content = ?, category_id = ?, image_url = ?, tags = ?
        WHERE id = ?
      `;
      db.query(sql, [title, short_description, content, category_id, image_url, tags || null, id], (err) => {
        if (err) {
          console.error('[UPDATE BLOG] Error updating blog in DB:', err);
          return res.status(500).json({ message: 'Error updating blog', error: err.message });
        }
        res.status(200).json({ message: 'Blog updated successfully', image_url: image_url });
      });
    };

    // Handle image upload if a new image is provided
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const sanitizedFileName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `blog_${Date.now()}_${sanitizedFileName}`; // Updated filename prefix
      const filepath = path.join(blogsDir, filename); // Updated directory

      console.log(`[UPDATE BLOG] Attempting to move new file: ${imageFile.name} to ${filepath}`); // Debug log
      imageFile.mv(filepath, (err) => {
        if (err) {
          console.error('[UPDATE BLOG] Error uploading new blog image:', err);
          updateBlogInDb();
        } else {
          image_url = `/uploads/blogs/${filename}`; // Updated URL path
          console.log(`[UPDATE BLOG] New image uploaded successfully, image_url: ${image_url}`); // Debug log
          updateBlogInDb();
        }
      });
    } else {
      console.log('[UPDATE BLOG] No new image provided for update. Using existing or null image_url.'); // Debug log
      updateBlogInDb(); // Proceed directly if no new image
    }
  });

  // Delete a blog by ID
  app.delete('/delete-blog/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM blogs WHERE id = ?'; // Updated table name
    db.query(sql, [id], (err) => {
      if (err) {
        console.error('Error deleting blog:', err);
        return res.status(500).json({ message: 'Error deleting blog' });
      }
      res.status(200).json({ message: 'Blog deleted successfully' });
    });
  });


  // FAQ API ENDPOINTS (NEW)

  // Add a new FAQ
  app.post('/add-faq', (req, res) => {
    const { question, answer, category_id } = req.body;
    if (!question || !answer || !category_id) {
      return res.status(400).json({ message: 'Question, answer, and category ID are required' });
    }
    const sql = 'INSERT INTO faqs (question, answer, category_id) VALUES (?, ?, ?)';
    db.query(sql, [question, answer, category_id], (err, result) => {
      if (err) {
        console.error("Error inserting FAQ:", err);
        return res.status(500).json({ message: 'Error inserting FAQ' });
      }
      res.status(200).json({ message: 'FAQ added successfully', id: result.insertId });
    });
  });

  // Get all FAQs
  app.get('/faqs', (req, res) => {
    // Joining with the category table to get the category name for display
    const sql = `
      SELECT f.id, f.question, f.answer, f.category_id, c.name as category_name
      FROM faqs f
      JOIN category c ON f.category_id = c.id
      ORDER BY f.created_at DESC
    `;
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching FAQs:", err);
        return res.status(500).json({ message: 'Error retrieving FAQs' });
      }
      res.status(200).json(results);
    });
  });

  // Get a specific FAQ by ID
  app.get('/faqs/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
      SELECT f.id, f.question, f.answer, f.category_id, c.name as category_name
      FROM faqs f
      JOIN category c ON f.category_id = c.id
      WHERE f.id = ?
    `;
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error fetching FAQ:', err);
        return res.status(500).json({ message: 'Error retrieving FAQ' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'FAQ not found' });
      }
      res.status(200).json(results[0]);
    });
  });

  // Update an existing FAQ by ID
  app.put('/update-faq/:id', (req, res) => {
    const { id } = req.params;
    const { question, answer, category_id } = req.body;
    if (!question || !answer || !category_id) {
      return res.status(400).json({ message: 'Question, answer, and category ID are required' });
    }
    const sql = 'UPDATE faqs SET question = ?, answer = ?, category_id = ? WHERE id = ?';
    db.query(sql, [question, answer, category_id, id], (err) => {
      if (err) {
        console.error('Error updating FAQ:', err);
        return res.status(500).json({ message: 'Error updating FAQ' });
      }
      res.status(200).json({ message: 'FAQ updated successfully' });
    });
  });

  // Delete an FAQ by ID
  app.delete('/delete-faq/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM faqs WHERE id = ?';
    db.query(sql, [id], (err) => {
      if (err) {
        console.error('Error deleting FAQ:', err);
        return res.status(500).json({ message: 'Error deleting FAQ' });
      }
      res.status(200).json({ message: 'FAQ deleted successfully' });
    });
  });


  // IMAGE UPLOAD ENDPOINTS (For subsubcategories sections, potentially unused if handled internally now)

  // Handle section image uploads (multipart/form-data)
  app.post('/upload-section-image', (req, res) => {
    console.log('Received upload request for section image');

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No file uploaded for section image' });
    }

    const file = req.files.image;
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `section_${Date.now()}_${sanitizedFileName}`;
    const filepath = path.join(sectionsDir, filename);

    console.log('Saving section image file to:', filepath);

    file.mv(filepath, (err) => {
      if (err) {
        console.error('Error uploading section image file:', err);
        return res.status(500).json({ message: 'Error uploading section image file', error: err.message });
      }

      const relativePath = `/uploads/sections/${filename}`;
      console.log('Section image file saved successfully. Path:', relativePath);

      res.status(200).json({
        filename,
        path: relativePath
      });
    });
  });

  // Handle base64 image uploads (potentially unused if handled internally now)
  app.post('/api/upload-base64-image', (req, res) => {
    try {
      const { base64Image } = req.body;

      if (!base64Image) {
        return res.status(400).json({ message: 'No image data provided' });
      }

      const matches = base64Image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);

      if (!matches || matches.length !== 3) {
        return res.status(400).json({ message: 'Invalid image format' });
      }

      const imageType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      const filename = `section_${Date.now()}.${imageType}`;
      const filepath = path.join(sectionsDir, filename);

      fs.writeFileSync(filepath, buffer);

      const relativePath = `/uploads/sections/${filename}`;
      res.status(200).json({
        success: true,
        path: relativePath
      });
    } catch (error) {
      console.error('Error processing base64 image:', error);
      res.status(500).json({
        message: 'Error processing image',
        error: error.message
      });
    }
  });

  // GLOBAL SEARCH API ENDPOINT

  // Search categories, subcategories, and Services
  app.get('/api/search', (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.json([]);
    }

    const searchTerm = `%${query}%`;

    const sql = `
      SELECT 'category' as type, id, name, NULL as parent_name, NULL as parent_id
      FROM category
      WHERE name LIKE ?

      UNION ALL

      SELECT 'subcategory' as type, sc.id, sc.name, c.name as parent_name, sc.category_id as parent_id
      FROM subcategories sc
      JOIN category c ON sc.category_id = c.id
      WHERE sc.name LIKE ?

      UNION ALL

      SELECT 'Services' as type, ssc.id, ssc.name, sc.name as parent_name, ssc.subcategory_id as parent_id
      FROM subsubcategories ssc
      JOIN subcategories sc ON ssc.subcategory_id = sc.id
      WHERE ssc.name LIKE ?

      LIMIT 15
    `;

    db.query(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) {
        console.error('Error performing search:', err);
        return res.status(500).json({ message: 'Error performing search' });
      }

      // Group results by type
      const groupedResults = {
        categories: results.filter(item => item.type === 'category'),
        subcategories: results.filter(item => item.type === 'subcategory'),
        subsubcategories: results.filter(item => item.type === 'Services')
      };

      res.json(groupedResults);
    });
  });

  // TRADEMARKS API ROUTE (External API Proxy)

  // Proxy endpoint for fetching trademark data from an external API
  app.get('/api/trademarks', async (req, res) => {
    try {
      // Extract query parameters
      const {
        word_mark = '',
        class_detail = '',
        class_number = '',
        status = 'Registered',
        limit = 10,
        offset = 0,
        match_type = 'SMART'
      } = req.query;

      const binbashApiKey = process.env.BINBASH_API_KEY;
      if (!binbashApiKey) {
        return res.status(500).json({ message: 'BINBASH_API_KEY is not configured' });
      }

      // Build the URL with query parameters
      const params = new URLSearchParams();
      if (word_mark) params.append('word_mark', word_mark);
      if (class_detail) params.append('class_detail', class_detail);
      if (class_number) params.append('class_number', class_number);
      if (status) params.append('status', status);
      params.append('limit', limit);
      params.append('offset', offset);
      params.append('match_type', match_type);

      const url = `https://api.binbash.ai/api/v2/trademarks/?${params.toString()}`;

      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Api-Key ${binbashApiKey}`,
          'Accept': 'application/json'
        }
      };

      const response = await fetch(url, options);

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('API returned non-JSON response:', contentType);
        return res.status(502).json({
          message: 'External API returned an invalid response format'
        });
      }

      // Handle error responses
      if (!response.ok) {
        console.error('External API error:', response.status, response.statusText);
        return res.status(500).json({
          message: `Error from external API: ${response.statusText}`
        });
      }

      // Parse JSON response
      const data = await response.json();
      return res.status(200).json(data);

    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  });

  // USER API ENDPOINTS

  // Get all users
  app.get("/users", (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ message: "Error retrieving data" });
        return;
      }
      res.json(results);
    });
  });

};
