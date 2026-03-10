#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Start a new PHAROS test run and re-baseline the current frontend and backend changes. Treat recursive carry-forward as deliberate lineage, not contamination, unless cross-source bleed is unintended."

backend:
  - task: "PHAROS backend smoke validation"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "New test run initialized. Backend smoke validation pending for current server changes."
      - working: true
        agent: "main"
        comment: "Passed syntax smoke check with `python3 -m py_compile backend/server.py`. Full API integration test not run in this pass because no live backend + database stack was started."
  - task: "PHAROS backend live API validation"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Second-pass task added. Need to run the FastAPI backend against a live Mongo connection and verify key PHAROS endpoints."
      - working: true
        agent: "main"
        comment: "Passed in-process FastAPI harness validation with a fake database layer when no Mongo daemon was initially available."
      - working: true
        agent: "main"
        comment: "Passed live API validation against a temporary MongoMemoryServer instance and a real `uvicorn server:app` process on `http://127.0.0.1:9202`. Verified health, publications, services, admin login, platform status, bookings create/list/status/delete, and publications create/delete."

frontend:
  - task: "PHAROS frontend build validation"
    implemented: true
    working: true
    file: "frontend/src/App.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "New test run initialized. Need a clean frontend build against current PHAROS changes."
      - working: true
        agent: "main"
        comment: "Passed production build with `npm run build` in `frontend/`. Build completed successfully and emitted optimized assets."
  - task: "Trust Advantage route validation"
    implemented: true
    working: true
    file: "frontend/src/pages/TrustAdvantageAnalysis.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "New route present in working tree and should be included in this test run."
      - working: true
        agent: "main"
        comment: "Static route validation passed. Confirmed import in `frontend/src/App.js`, route registration for `/publications/trust-advantage-analysis`, and matching publication link/seed references in frontend and backend."
  - task: "Trust Advantage publication asset validation"
    implemented: true
    working: true
    file: "frontend/public/publications/trust-advantage-analysis-march-2026.docx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Second-pass task added. Need to verify the publication asset exists and is included in the built output."
      - working: true
        agent: "main"
        comment: "Passed asset validation. Confirmed the `.docx` exists in both `frontend/public/publications/` and `frontend/build/publications/`, the built `_redirects` file contains `/* /index.html 200`, and the built asset served with HTTP 200 from a temporary local static server."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Initialized a new PHAROS test run. Starting with frontend build validation and backend smoke checks from the current workspace state."
  - agent: "main"
    message: "Baseline run completed. Frontend production build passed, backend syntax smoke passed, and Trust Advantage route wiring was confirmed. Interactive UI and live API integration remain unrun in this test pass."
  - agent: "main"
    message: "Continuing the test loop instead of deferring. Next pass is live backend/API validation plus built publication asset verification."
  - agent: "main"
    message: "Live backend/API pass succeeded with a temporary MongoMemoryServer-backed stack, and the built Trust Advantage publication asset served correctly. Current PHAROS local test loop is green."
