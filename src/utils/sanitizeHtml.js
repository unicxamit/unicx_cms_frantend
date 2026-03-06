const BLOCKED_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "form",
]);

const isUnsafeUrl = (value) => /^javascript:/i.test((value || "").trim());

export default function sanitizeHtml(input) {
  if (!input) return "";
  if (typeof window === "undefined") return String(input);

  const template = document.createElement("template");
  template.innerHTML = String(input);

  const elements = template.content.querySelectorAll("*");
  elements.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (BLOCKED_TAGS.has(tag)) {
      el.remove();
      return;
    }

    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value || "";

      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
        return;
      }

      if ((name === "href" || name === "src" || name === "xlink:href" || name === "formaction") && isUnsafeUrl(value)) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return template.innerHTML;
}
