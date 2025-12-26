export interface SampleData {
  id: string;
  label: string;
  resume: string;
  job: string;
}

export const SAMPLE_ROLES: SampleData[] = [
  // TECH SALES - STRONG CANDIDATE (replacing Frontend Developer)
  { 
    id: 'tech-sales',
    label: 'Tech Sales',
    resume: `MARCUS JOHNSON
Enterprise Account Executive | SaaS Sales Professional
Austin, TX | (512) 555-8234 | marcus.johnson@email.com | linkedin.com/in/marcusjohnson

PROFESSIONAL SUMMARY
Results-driven Enterprise Account Executive with 7+ years of B2B SaaS sales experience. Consistent top performer with proven track record of exceeding quota by 120%+ annually. Expert in consultative selling, complex deal negotiations, and building C-suite relationships.

PROFESSIONAL EXPERIENCE

Senior Enterprise Account Executive | CloudScale Technologies | Jan 2021 - Present
• Closed $4.2M in new ARR in 2023, achieving 142% of quota and ranking #1 on team of 12 reps
• Manage strategic accounts with deal sizes ranging from $150K to $800K ACV
• Developed account-based marketing strategies resulting in 35% increase in pipeline
• Built relationships with C-suite executives at Fortune 500 companies including Dell, AMD, and Oracle
• Reduced average sales cycle from 9 months to 6 months through improved discovery process
• Mentored 3 junior AEs, helping them achieve quota within their first year

Account Executive | TechVenture Solutions | Mar 2018 - Dec 2020
• Exceeded annual quota by average of 118% over 3 years, generating $2.1M in total revenue
• Managed full sales cycle from prospecting to close for mid-market accounts ($50K-$200K)
• Collaborated with Solutions Engineers to deliver technical demonstrations and POCs
• Maintained 94% customer retention rate through proactive relationship management

Sales Development Representative | DataFirst Inc | Jun 2016 - Feb 2018
• Generated 180+ qualified opportunities resulting in $1.8M in closed revenue
• Exceeded monthly meeting quota by 130% through strategic outbound prospecting

EDUCATION
BBA, Marketing | University of Texas at Austin | 2016

SKILLS
Salesforce CRM, HubSpot, LinkedIn Sales Navigator, MEDDIC/MEDDPICC, Solution Selling, Contract Negotiation, Executive Presentations, Pipeline Management, Forecasting`,
    job: `ENTERPRISE ACCOUNT EXECUTIVE - CLOUD SOLUTIONS

About the Role:
We're seeking a high-performing Enterprise Account Executive to drive new business acquisition for our cloud infrastructure platform. You'll own the full sales cycle for enterprise accounts and help shape our go-to-market strategy.

Requirements:
• 5+ years of B2B SaaS sales experience with consistent quota attainment
• Proven track record closing enterprise deals ($100K+ ACV)
• Experience selling technical solutions to IT and engineering leaders
• Strong understanding of MEDDIC or similar enterprise sales methodologies
• Proficiency with Salesforce CRM and sales engagement tools
• Excellent presentation and negotiation skills
• Bachelor's degree required

Responsibilities:
• Drive new logo acquisition and expand existing accounts
• Manage complex sales cycles with multiple stakeholders
• Partner with Solutions Engineering for technical demonstrations
• Develop and execute territory and account plans
• Accurate forecasting and pipeline management
• Build relationships with C-level executives and key decision makers

Compensation: $120K-$150K base + uncapped commission (OTE $280K-$350K)
Benefits: Full health coverage, 401k match, equity, unlimited PTO`
  },

  // MARKETING MANAGER - MEDIUM CANDIDATE (some gaps)
  { 
    id: 'marketing-manager',
    label: 'Marketing Manager',
    resume: `CARLOS RUIZ
Marketing Professional
Denver, CO | carlos.ruiz@email.com | (303) 555-4921

SUMMARY
Marketing professional with 5 years experience in digital marketing and content creation. Background in social media management and email campaigns.

EXPERIENCE

Marketing Coordinator | GrowthCorp | 2020 - Present
• Manage company social media accounts on LinkedIn, Twitter, and Instagram
• Write blog posts and marketing emails, achieving 22% average open rate
• Coordinate with external agencies on paid advertising campaigns
• Assist in trade show planning and event marketing
• Create marketing materials using Canva and basic Adobe tools

Digital Marketing Associate | StartupInc | 2018 - 2020
• Supported senior marketers with campaign execution
• Managed email list and sent weekly newsletters
• Tracked campaign metrics in Google Analytics
• Responded to social media comments and messages

Marketing Intern | LocalBiz Agency | 2017 - 2018
• Assisted with content creation and scheduling
• Researched competitor marketing strategies
• Helped organize client files and reports

EDUCATION
BA Communications | Colorado State University | 2017

SKILLS
Social Media Management, Canva, Mailchimp, Google Analytics, WordPress, Content Writing, Email Marketing`,
    job: `SENIOR DIGITAL MARKETING MANAGER

About Us:
Fast-growing B2B SaaS company seeking experienced marketing leader to scale our demand generation engine and drive measurable pipeline growth.

Requirements:
• 7+ years of B2B digital marketing experience
• Deep expertise in marketing automation (HubSpot, Marketo, or Pardot)
• Proven experience with ABM strategies and tools (6sense, Demandbase)
• Strong analytical skills with experience in attribution modeling
• Track record of managing $500K+ marketing budgets
• Experience leading and developing marketing teams
• Expert knowledge of SEO/SEM and paid acquisition channels
• Proficiency in SQL or BI tools for marketing analytics

Key Responsibilities:
• Develop and execute integrated demand generation strategies
• Own marketing qualified leads (MQL) targets and conversion metrics
• Manage and optimize paid media spend across channels
• Lead a team of 3-4 marketing specialists
• Implement and optimize marketing automation workflows
• Partner with sales on lead scoring and handoff processes
• Report on marketing ROI and pipeline contribution to executives

Salary Range: $130,000 - $160,000 + bonus
Location: Denver, CO (Hybrid - 3 days in office)`
  },

  // PROJECT MANAGER - STRONG CANDIDATE
  { 
    id: 'project-manager',
    label: 'Project Manager',
    resume: `SARAH CHEN, PMP, CSM
Senior Technical Project Manager
Seattle, WA | (206) 555-7832 | sarah.chen@email.com | linkedin.com/in/sarahchenpm

PROFESSIONAL SUMMARY
Certified Project Management Professional (PMP) and Scrum Master with 8+ years leading complex technical projects in enterprise software and cloud infrastructure. Proven track record delivering $10M+ programs on time and under budget while managing cross-functional teams of 20+ members.

PROFESSIONAL EXPERIENCE

Senior Technical Project Manager | Amazon Web Services | Mar 2020 - Present
• Lead delivery of enterprise cloud migration programs valued at $15M+ annually
• Manage portfolio of 8-12 concurrent projects across multiple AWS service teams
• Reduced project delivery time by 25% through implementation of standardized Agile frameworks
• Achieved 98% on-time delivery rate across 40+ projects over 3 years
• Facilitate sprint planning, daily standups, and retrospectives for 4 scrum teams
• Built PMO processes adopted across the organization, improving resource utilization by 30%

Technical Project Manager | Microsoft | Jan 2017 - Feb 2020
• Managed Azure platform feature releases with cross-functional teams of 15-25 engineers
• Owned end-to-end delivery of $8M infrastructure modernization program
• Implemented risk management framework that reduced project escalations by 40%
• Coordinated with stakeholders across 5 time zones, maintaining 95% satisfaction scores

Project Coordinator | Expedia Group | Jun 2014 - Dec 2016
• Supported senior PMs on travel platform development initiatives
• Managed project documentation, status reporting, and stakeholder communications
• Led small enhancement projects independently, delivering 12 releases on schedule

EDUCATION & CERTIFICATIONS
• PMP Certification | Project Management Institute | 2018
• Certified Scrum Master (CSM) | Scrum Alliance | 2017
• MBA, Technology Management | University of Washington | 2016
• BS Computer Science | University of California, Berkeley | 2014

SKILLS
Agile/Scrum, Waterfall, JIRA, Confluence, MS Project, Smartsheet, Risk Management, Stakeholder Management, Budget Management, Vendor Management, Executive Reporting, Team Leadership`,
    job: `SENIOR TECHNICAL PROJECT MANAGER

Company Overview:
Leading enterprise software company seeking experienced Technical Project Manager to drive delivery of our next-generation cloud platform.

Requirements:
• 6+ years of technical project management experience
• PMP certification required; CSM or SAFe certification preferred
• Proven experience managing complex software development projects
• Strong background in Agile methodologies (Scrum, Kanban)
• Experience with JIRA, Confluence, and project management tools
• Track record managing projects with budgets of $5M+
• Excellent stakeholder management and executive communication skills
• Experience in cloud technologies (AWS, Azure, or GCP)

Responsibilities:
• Lead delivery of strategic platform initiatives across engineering teams
• Manage project scope, timeline, budget, and resources
• Facilitate Agile ceremonies and drive continuous improvement
• Identify and mitigate project risks proactively
• Provide executive-level status reporting and steering committee updates
• Coordinate cross-functional dependencies and remove blockers
• Mentor junior project managers and contribute to PMO best practices

Compensation: $140,000 - $175,000 base salary
Benefits: Stock options, 401k match, comprehensive health benefits`
  },

  // DATA ANALYST - WEAK CANDIDATE (junior applying for senior role)
  { 
    id: 'data-analyst',
    label: 'Data Analyst',
    resume: `KEVIN PATEL
Data Analyst
Chicago, IL | kevin.patel@email.com

ABOUT ME
Recent graduate passionate about data and analytics. Looking to grow my career in data science and business intelligence.

EXPERIENCE

Data Analyst Intern | LocalRetail Co | Summer 2023
• Created Excel reports for store managers
• Helped clean data files for monthly reporting
• Attended meetings with the analytics team
• Learned basics of SQL queries

Student Research Assistant | University Lab | 2022-2023
• Entered survey data into spreadsheets
• Ran basic statistical tests in SPSS
• Helped professors organize research files

EDUCATION
BS Business Administration | University of Illinois Chicago | 2023
Relevant Coursework: Statistics 101, Introduction to Excel, Business Analytics

PROJECTS
• Class project: Analyzed sales data in Excel with pivot tables
• Created a simple dashboard in Google Sheets for a class presentation

SKILLS
Microsoft Excel, Google Sheets, Basic SQL, SPSS, PowerPoint, Data Entry, Attention to Detail

INTERESTS
Learning Python, interested in machine learning`,
    job: `SENIOR DATA ANALYST - PRODUCT ANALYTICS

About the Team:
Our Product Analytics team drives data-informed decisions across the organization. We're seeking a Senior Data Analyst to lead complex analyses and mentor junior team members.

Requirements:
• 5+ years of professional data analysis experience
• Expert proficiency in SQL (complex queries, window functions, CTEs)
• Advanced Python skills (Pandas, NumPy, scikit-learn)
• Experience with data visualization tools (Tableau, Looker, or Power BI)
• Strong statistical background (A/B testing, regression, cohort analysis)
• Experience with big data technologies (Spark, BigQuery, Redshift)
• Track record of translating data into actionable business recommendations
• Experience mentoring junior analysts

Responsibilities:
• Lead end-to-end analysis projects from scoping to executive presentation
• Build and maintain dashboards for product and leadership teams
• Design and analyze A/B tests for product feature launches
• Develop predictive models for user behavior and churn
• Partner with Product and Engineering to define success metrics
• Mentor junior analysts and establish analytics best practices
• Present findings to senior leadership and drive data-driven decisions

Compensation: $120,000 - $150,000 + equity
Location: Chicago, IL (Hybrid)`
  },

  // CUSTOMER SUCCESS - MEDIUM CANDIDATE
  { 
    id: 'customer-success',
    label: 'Customer Success',
    resume: `AMANDA TORRES
Customer Success Professional
San Francisco, CA | (415) 555-2847 | amanda.torres@email.com

PROFESSIONAL SUMMARY
Customer-focused professional with 4 years experience in SaaS customer success. Strong relationship builder with track record of improving customer satisfaction and retention.

EXPERIENCE

Customer Success Manager | TechStartup Inc | 2021 - Present
• Manage portfolio of 45 SMB and mid-market accounts ($500K ARR)
• Achieved 91% gross retention rate and 105% net retention through upsells
• Conduct quarterly business reviews and product training sessions
• Reduced time-to-value for new customers from 60 to 35 days
• Collaborated with product team on feature requests and bug prioritization

Customer Support Lead | SaaSCompany | 2019 - 2021
• Handled escalated customer issues and complex technical problems
• Maintained 96% customer satisfaction score on support tickets
• Created knowledge base articles reducing common ticket volume by 20%
• Trained new support team members on product and processes

Customer Service Representative | RetailCorp | 2017 - 2019
• Resolved customer inquiries via phone and email
• Processed returns and handled billing questions
• Consistently exceeded call handling metrics

EDUCATION
BA Psychology | San Francisco State University | 2017

SKILLS
Salesforce, Zendesk, Intercom, Customer Onboarding, Relationship Building, Problem Solving, Product Training, Renewal Management`,
    job: `SENIOR CUSTOMER SUCCESS MANAGER - ENTERPRISE

About Us:
High-growth enterprise SaaS platform seeking experienced CSM to manage our most strategic accounts and drive expansion revenue.

Requirements:
• 5+ years of customer success or account management experience
• Experience managing enterprise accounts ($500K+ ARR)
• Proven track record of 95%+ gross retention and 115%+ net retention
• Strong executive presence and C-suite relationship skills
• Experience with enterprise SaaS products and complex implementations
• Proficiency with Gainsight or similar CS platforms
• Strong analytical skills for health scoring and risk identification
• Experience building customer success playbooks and processes

Key Responsibilities:
• Own relationships with 15-20 enterprise accounts ($10M+ total ARR)
• Drive adoption, expansion, and renewal for strategic customers
• Conduct executive business reviews with VP/C-level stakeholders
• Develop and execute success plans aligned to customer outcomes
• Identify and close upsell/cross-sell opportunities
• Partner with Sales, Product, and Support on customer advocacy
• Build scalable processes and playbooks for the CS team
• Mentor junior CSMs and contribute to team development

Compensation: $130,000 - $160,000 + variable compensation
Location: San Francisco, CA (Hybrid - 2 days in office)`
  },

  // LOGISTICS MANAGER - STRONG CANDIDATE (new)
  { 
    id: 'logistics-manager',
    label: 'Logistics Manager',
    resume: `DAVID MARTINEZ
Senior Logistics & Supply Chain Manager
Dallas, TX | (214) 555-9182 | david.martinez@email.com | linkedin.com/in/davidmartinezscm

PROFESSIONAL SUMMARY
Results-oriented Supply Chain and Logistics Manager with 10+ years of experience optimizing distribution networks, reducing costs, and improving operational efficiency. Expertise in warehouse management, transportation logistics, and inventory optimization. Six Sigma Green Belt certified with proven track record of driving continuous improvement initiatives.

PROFESSIONAL EXPERIENCE

Senior Logistics Manager | Amazon Fulfillment | Feb 2019 - Present
• Oversee operations for 500,000 sq ft distribution center processing 150,000+ units daily
• Lead team of 85 warehouse associates and 8 supervisors across 3 shifts
• Reduced shipping costs by 18% ($2.4M annually) through carrier optimization and route planning
• Improved order accuracy from 97.2% to 99.6% through process standardization
• Implemented WMS upgrades resulting in 25% improvement in pick efficiency
• Achieved 99.2% on-time delivery rate, exceeding company target by 2%
• Led successful peak season operations, managing 3x volume increase

Logistics Manager | Target Distribution | Jun 2015 - Jan 2019
• Managed inbound/outbound logistics for regional distribution center serving 120 stores
• Negotiated carrier contracts saving $1.2M annually in transportation costs
• Implemented cross-docking program reducing inventory holding costs by 15%
• Developed KPI dashboards improving visibility into operational metrics
• Supervised team of 45 associates and maintained <5% turnover rate

Supply Chain Analyst | Walmart Logistics | Aug 2012 - May 2015
• Analyzed transportation data to identify cost reduction opportunities
• Supported implementation of transportation management system (TMS)
• Created demand forecasting models improving inventory planning accuracy

EDUCATION & CERTIFICATIONS
• Six Sigma Green Belt | ASQ | 2018
• APICS CSCP (Certified Supply Chain Professional) | 2017
• MBA, Supply Chain Management | University of Texas at Dallas | 2015
• BS Industrial Engineering | Texas A&M University | 2012

SKILLS
WMS (Manhattan, SAP), TMS (Oracle, JDA), Inventory Management, Demand Planning, Carrier Negotiation, Lean/Six Sigma, Team Leadership, P&L Management, Safety Compliance, Continuous Improvement`,
    job: `DIRECTOR OF LOGISTICS & DISTRIBUTION

Company Overview:
National e-commerce retailer seeking experienced logistics leader to oversee our distribution network and drive operational excellence.

Requirements:
• 8+ years of logistics/distribution management experience
• Experience managing large-scale distribution operations (300K+ sq ft)
• Proven track record of cost reduction and efficiency improvement
• Strong knowledge of WMS and TMS platforms
• Six Sigma or Lean certification preferred
• APICS certification (CSCP, CPIM) preferred
• Experience with e-commerce fulfillment operations
• Bachelor's degree required; MBA preferred

Responsibilities:
• Oversee 3 distribution centers with combined 1.2M sq ft and 400+ employees
• Develop and execute logistics strategy aligned with business growth
• Drive continuous improvement initiatives across the network
• Manage $45M annual logistics budget and P&L responsibility
• Negotiate contracts with carriers and 3PL partners
• Ensure compliance with safety regulations and company policies
• Lead, develop, and retain high-performing operations teams
• Report on KPIs and operational metrics to executive leadership

Compensation: $150,000 - $180,000 base + 20% bonus potential
Benefits: Full benefits, 401k match, relocation assistance available`
  },

  // FULL STACK DEVELOPER - WEAK CANDIDATE (bootcamp grad, lacks enterprise experience)
  { 
    id: 'fullstack-dev',
    label: 'Full Stack Developer',
    resume: `JASON KIM
Full Stack Developer
Portland, OR | jason.kim@email.com | github.com/jasonkim

ABOUT ME
Career changer with passion for coding. Completed intensive coding bootcamp and built several personal projects. Eager to learn and grow as a developer.

EXPERIENCE

Freelance Web Developer | Self-Employed | 2023 - Present
• Built websites for 3 small local businesses using WordPress
• Created a simple React app for a friend's restaurant menu
• Fixed bugs on client websites as needed

Teaching Assistant | CodeCamp Bootcamp | 2023
• Helped students with JavaScript exercises during evening sessions
• Answered questions in Slack and reviewed homework assignments

Previous Career: Restaurant Manager | Various | 2015 - 2022
• Managed staff scheduling and inventory
• Handled customer complaints and daily operations

EDUCATION
Full Stack Web Development Certificate | CodeCamp Bootcamp | 2023 (12-week program)
BA English Literature | Portland State University | 2015

PROJECTS
• Personal Portfolio: Built with React and deployed on Netlify
• Todo App: CRUD application using Node.js and MongoDB
• Weather App: Fetches data from weather API, displays forecast
• Blog Site: WordPress theme customization for personal blog

SKILLS
HTML, CSS, JavaScript, React (basics), Node.js (basics), MongoDB, Git, VS Code, Responsive Design

CURRENTLY LEARNING
TypeScript, PostgreSQL, Docker`,
    job: `SENIOR FULL STACK ENGINEER

About Us:
Series B fintech startup building next-generation payment infrastructure. We're looking for experienced engineers to scale our platform.

Requirements:
• 5+ years of professional software development experience
• Strong proficiency in TypeScript and modern JavaScript
• Experience with React and state management (Redux, Zustand)
• Backend expertise with Node.js and PostgreSQL
• Experience designing and building RESTful APIs and microservices
• Familiarity with AWS services (EC2, RDS, Lambda, S3)
• Experience with CI/CD pipelines and infrastructure as code
• Understanding of security best practices in financial applications
• Experience with test-driven development and automated testing

Nice to Have:
• Experience in payments or fintech industry
• Knowledge of Docker, Kubernetes, and container orchestration
• Experience with event-driven architectures (Kafka, RabbitMQ)
• Familiarity with PCI-DSS compliance requirements

Responsibilities:
• Design and implement scalable backend services
• Build responsive and performant frontend applications
• Participate in system design and architecture decisions
• Write clean, tested, and well-documented code
• Mentor junior developers and conduct code reviews
• Participate in on-call rotation for production systems

Compensation: $160,000 - $200,000 + equity
Location: Remote (US)`
  }
];
