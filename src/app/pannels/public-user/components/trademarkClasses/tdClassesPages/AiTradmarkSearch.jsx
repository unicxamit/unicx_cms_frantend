import React, { useState } from "react";
import { Loader2, CheckCircle, Zap, Search } from "lucide-react";
import "../tdClassCss/aiTradmarkClassSearch.css"
const AiTradmarkSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState("initial"); // initial, loading, complete
  const [AIStatusMessage, setAIStatusMessage] = useState(
    "Enter a brand name to start AI analysis."
  );
  const [searchReport, setSearchReport] = useState("");

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setAIStatusMessage("Please enter a brand name to search.");
      setSearchStatus("initial");
      return;
    }
    
    setSearchStatus("loading");
    setSearchReport("");
    setAIStatusMessage(`Analyzing data for "${searchTerm}"...`);

    // Simulate API call delay
    setTimeout(() => {
      setSearchStatus("complete");
      
      // Dynamic report based on input for better demonstration
      let report;
      if (searchTerm.toLowerCase().includes("conflict")) {
        report = "❌ High conflict potential found.\n🚨 Direct match: ConflictMax (Registered in 2022).\n📊 Recommendation: Choose a new name.";
      } else if (searchTerm.toLowerCase().includes("safe")) {
        report = "✅ Excellent availability! No major conflicts found.\n🔍 Similar names: None.\n📊 Recommendation: Proceed immediately with registration.";
      } else {
        report = "⚠️ Moderate potential conflict.\n🔍 Similar names: AuraLinks, AuraConnect, Auramax Software.\n📊 Recommendation: Conduct a comprehensive legal opinion before proceeding.";
      }

      setSearchReport(report);
      setAIStatusMessage("Analysis Complete.");
    }, 2500);
  };

  // Component to display the different states of the analysis
  const AIAnalysisDisplay = () => {
    // Determine the result state classes
    let analysisClasses = "ai-analysis-box ";
    if (searchStatus === "initial") analysisClasses += "ai-analysis-initial";
    if (searchStatus === "loading") analysisClasses += "ai-analysis-loading";
    if (searchStatus === "complete") analysisClasses += "ai-analysis-complete";

    if (searchStatus === "initial") {
      return (
        <div className={analysisClasses}>
          <p className="ai-status-text">
            {AIStatusMessage}
          </p>
        </div>
      );
    }

    if (searchStatus === "loading") {
      return (
        <div className={analysisClasses}>
          <div className="ai-loading-content">
            <Loader2 className="ai-loader" />
            <p className="ai-loading-text">
              {AIStatusMessage}
            </p>
          </div>
        </div>
      );
    }

    // searchStatus === "complete"
    return (
      <div className={analysisClasses}>
        <div className="ai-result-header">
          <CheckCircle className="ai-check-icon" />
          <h3 className="ai-result-title">Analysis Report</h3>
        </div>
        <div className="ai-result-content">
          {searchReport.split("\n").map((line, index) => {
            let lineClass = "ai-report-line";
            if (line.startsWith("❌")) lineClass += " ai-report-conflict";
            else if (line.startsWith("⚠️")) lineClass += " ai-report-warning";
            else if (line.startsWith("✅")) lineClass += " ai-report-success";

            return (
              <p key={index} className={lineClass}>
                {line}
              </p>
            );
          })}
        </div>
      </div>
    );
  };
  return (
        <section id="ai-search" className="ai-page-container">
      {/* Custom, class-based CSS derived from Tailwind */}
      <div className="ai-card">
        <div className="ai-header-group">
          <Zap className="ai-zap-icon" />
          <h2 className="ai-title">
            AI Trademark & Brand Check
          </h2>
        </div>
        
        <p className="ai-description">
          Our intelligent system scans global databases, domains, and business registries to instantly assess the risk of your proposed brand name.
        </p>

        <div className="ai-input-group">
          <input
            type="text"
            placeholder="Enter brand name (e.g., 'AuraLink')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ai-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            disabled={searchStatus === "loading"}
          />
          <button
            className="ai-button"
            onClick={handleSearch}
            disabled={searchStatus === "loading"}
          >
            {searchStatus === "loading" ? (
                <Loader2 className="ai-search-icon animate-spin" />
            ) : (
                <Search className="ai-search-icon" />
            )}
            <span className="ai-button-text">Analyze</span>
          </button>
        </div>

        <AIAnalysisDisplay />
      </div>
    </section>
  )
}

export default AiTradmarkSearch
