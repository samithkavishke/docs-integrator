import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * WSO2 Integrator Documentation — Sidebar Configuration
 *
 * Structure follows the Documentation Blueprint (March 2026).
 * Seven top-level sections answering seven developer questions:
 *
 *   Get Started       — "I'm new — what is this and how do I begin?"
 *   Develop           — "How do I build, transform, and test X?"
 *   Connectors        — "Can I connect to Y?"
 *   GenAI             — "How do I build AI agents, RAG, or MCP?"
 *   Tutorials         — "Show me a complete, real example"
 *   Deploy & Operate  — "How do I ship, run, and secure this?"
 *   Reference         — "What's the exact syntax / config / API for Z?"
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    // ─────────────────────────────────────────────
    // GET STARTED
    // "I'm new — what is this and how do I begin?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Get Started',
      link: {type: 'doc', id: 'get-started/index'},
      items: [
        {
          type: 'category',
          label: 'What is WSO2 Integrator?',
          items: [
            'get-started/overview',
            'get-started/why-wso2-integrator',
            'get-started/key-concepts',
          ],
        },
        {
          type: 'category',
          label: 'Set Up',
          items: [
            'get-started/system-requirements',
            'get-started/install-ballerina',
            'get-started/install',
            'get-started/first-project',
            'get-started/understand-the-ide',
          ],
        },
        {
          type: 'category',
          label: 'Quick Starts',
          items: [
            'get-started/quick-start-api',
            'get-started/quick-start-event',
            'get-started/quick-start-file',
            'get-started/quick-start-automation',
            'get-started/quick-start-data-service',
            'get-started/quick-start-ai-agent',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // DEVELOP
    // "How do I build, transform, and test X?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Develop',
      link: {type: 'doc', id: 'develop/index'},
      items: [
        // 6.1 Create Integrations
        {
          type: 'category',
          label: 'Create Integrations',
          link: {type: 'doc', id: 'develop/create-integrations/index'},
          items: [
            'develop/create-integrations/create-new-integration',
            'develop/create-integrations/open-integration',
            'develop/create-integrations/explore-samples',
            'develop/create-integrations/create-library',
            'develop/create-integrations/import-external',
          ],
        },
        // 6.2 Project Views
        {
          type: 'category',
          label: 'Project Views',
          link: {type: 'doc', id: 'develop/project-views/index'},
          items: [
            'develop/project-views/workspace-view',
            'develop/project-views/integration-view',
            'develop/project-views/library-view',
          ],
        },
        // 6.3 Integration Artifacts
        {
          type: 'category',
          label: 'Integration Artifacts',
          link: {type: 'doc', id: 'develop/integration-artifacts/index'},
          items: [
            'develop/integration-artifacts/services',
            'develop/integration-artifacts/event-handlers',
            'develop/integration-artifacts/file-handlers',
            'develop/integration-artifacts/email',
            'develop/integration-artifacts/automation',
            'develop/integration-artifacts/data-persistence',
            'develop/integration-artifacts/other-artifacts',
          ],
        },
        // 6.4 Design Integration Logic
        {
          type: 'category',
          label: 'Design Integration Logic',
          link: {type: 'doc', id: 'develop/design-logic/index'},
          items: [
            'develop/design-logic/flow-designer',
            'develop/design-logic/connections',
            'develop/design-logic/control-flow',
            'develop/design-logic/error-handling',
            'develop/design-logic/expressions',
            'develop/design-logic/query-expressions',
            'develop/design-logic/configuration-management',
            'develop/design-logic/functions',
            'develop/design-logic/ballerina-pro-code',
            'develop/design-logic/java-interoperability',
          ],
        },
        // 6.5 Transform
        {
          type: 'category',
          label: 'Transform',
          items: [
            'develop/transform/data-mapper',
            'develop/transform/json',
            'develop/transform/xml',
            'develop/transform/csv-flat-file',
            'develop/transform/edi',
            'develop/transform/yaml-toml',
            'develop/transform/type-system',
            'develop/transform/query-expressions',
            'develop/transform/expressions-functions',
            'develop/transform/ai-assisted-mapping',
          ],
        },
        // 6.6 Try & Test
        {
          type: 'category',
          label: 'Try & Test',
          items: [
            'develop/test/try-it',
            'develop/test/unit-testing',
            'develop/test/test-services-clients',
            'develop/test/data-driven-tests',
            'develop/test/test-groups',
            'develop/test/mocking',
            'develop/test/execute-tests',
            'develop/test/code-coverage',
            'develop/test/ai-test-generation',
          ],
        },
        // 6.7 Debugging & Troubleshooting
        {
          type: 'category',
          label: 'Debugging & Troubleshooting',
          link: {type: 'doc', id: 'develop/debugging/index'},
          items: [
            'develop/debugging/editor-debugging',
            'develop/debugging/remote-debugging',
            'develop/debugging/strand-dumps',
            'develop/debugging/performance-profiling',
          ],
        },
        // 6.8 Organize Code
        {
          type: 'category',
          label: 'Organize Code',
          link: {type: 'doc', id: 'develop/organize-code/index'},
          items: [
            'develop/organize-code/packages-modules',
            'develop/organize-code/package-references',
            'develop/organize-code/manage-dependencies',
            'develop/organize-code/workspaces',
            'develop/organize-code/style-guide',
            'develop/organize-code/generate-documentation',
            'develop/organize-code/static-code-analysis',
          ],
        },
        // 6.9 Tools
        {
          type: 'category',
          label: 'Tools',
          link: {type: 'doc', id: 'develop/tools/index'},
          items: [
            'develop/tools/migration-tools',
            'develop/tools/openapi-tool',
            'develop/tools/graphql-tool',
            'develop/tools/asyncapi-tool',
            'develop/tools/grpc-tool',
            'develop/tools/health-tool',
            'develop/tools/edi-tool',
            'develop/tools/wsdl-tool',
            'develop/tools/xsd-tool',
            'develop/tools/scan-tool',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // CONNECTORS
    // "Can I connect to Y?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Connectors',
      link: {type: 'doc', id: 'connectors/index'},
      items: [
        // ── Connector Catalog ──
        // Each category links to its overview page; per-connector docs are nested beneath.
        {
          type: 'category',
          label: 'Connector Catalog',
          items: [
            // ── AI & Machine Learning ──
            {
              type: 'category',
              label: 'AI & Machine Learning',
              link: {type: 'doc', id: 'connectors/ai-llms'},
              collapsed: true,
              items: [
                {type:'category',label:'OpenAI Chat',collapsed:true,link:{type:'doc',id:'connectors/individual/openai-chat/overview'},items:['connectors/individual/openai-chat/setup','connectors/individual/openai-chat/actions','connectors/individual/openai-chat/examples']},
                {type:'category',label:'Azure OpenAI Chat',collapsed:true,link:{type:'doc',id:'connectors/individual/azure-openai-chat/overview'},items:['connectors/individual/azure-openai-chat/setup','connectors/individual/azure-openai-chat/actions','connectors/individual/azure-openai-chat/examples']},
                {type:'category',label:'AI Agent Framework',collapsed:true,link:{type:'doc',id:'connectors/individual/ai-agent/overview'},items:['connectors/individual/ai-agent/setup','connectors/individual/ai-agent/actions','connectors/individual/ai-agent/examples']},
                {type:'category',label:'Anthropic Claude',collapsed:true,link:{type:'doc',id:'connectors/individual/ai-anthropic/overview'},items:['connectors/individual/ai-anthropic/setup','connectors/individual/ai-anthropic/actions','connectors/individual/ai-anthropic/examples']},
                {type:'category',label:'OpenAI (LLM Provider)',collapsed:true,link:{type:'doc',id:'connectors/individual/ai-openai/overview'},items:['connectors/individual/ai-openai/setup','connectors/individual/ai-openai/actions','connectors/individual/ai-openai/examples']},
                {type:'category',label:'Azure OpenAI (LLM Provider)',collapsed:true,link:{type:'doc',id:'connectors/individual/ai-azure/overview'},items:['connectors/individual/ai-azure/setup','connectors/individual/ai-azure/actions','connectors/individual/ai-azure/examples']},
                {type:'category',label:'Ollama',collapsed:true,link:{type:'doc',id:'connectors/individual/ai-ollama/overview'},items:['connectors/individual/ai-ollama/setup','connectors/individual/ai-ollama/actions','connectors/individual/ai-ollama/examples']},
                {type:'category',label:'Deepseek',collapsed:true,link:{type:'doc',id:'connectors/individual/ai-deepseek/overview'},items:['connectors/individual/ai-deepseek/setup','connectors/individual/ai-deepseek/actions','connectors/individual/ai-deepseek/examples']},
                {type:'category',label:'Mistral AI',collapsed:true,link:{type:'doc',id:'connectors/individual/ai-mistral/overview'},items:['connectors/individual/ai-mistral/setup','connectors/individual/ai-mistral/actions','connectors/individual/ai-mistral/examples']},
                {type:'category',label:'Pinecone',collapsed:true,link:{type:'doc',id:'connectors/individual/ai-pinecone/overview'},items:['connectors/individual/ai-pinecone/setup','connectors/individual/ai-pinecone/actions','connectors/individual/ai-pinecone/examples']},
                {type:'category',label:'Milvus (AI)',collapsed:true,link:{type:'doc',id:'connectors/individual/ai-milvus/overview'},items:['connectors/individual/ai-milvus/setup','connectors/individual/ai-milvus/actions','connectors/individual/ai-milvus/examples']},
                {type:'category',label:'Weaviate (AI)',collapsed:true,link:{type:'doc',id:'connectors/individual/ai-weaviate/overview'},items:['connectors/individual/ai-weaviate/setup','connectors/individual/ai-weaviate/actions','connectors/individual/ai-weaviate/examples']},
                {type:'category',label:'pgvector',collapsed:true,link:{type:'doc',id:'connectors/individual/ai-pgvector/overview'},items:['connectors/individual/ai-pgvector/setup','connectors/individual/ai-pgvector/actions','connectors/individual/ai-pgvector/examples']},
                {type:'category',label:'Devant Document Processing',collapsed:true,link:{type:'doc',id:'connectors/individual/ai-devant/overview'},items:['connectors/individual/ai-devant/setup','connectors/individual/ai-devant/actions','connectors/individual/ai-devant/examples']},
                {type:'category',label:'Milvus Vector Database',collapsed:true,link:{type:'doc',id:'connectors/individual/milvus/overview'},items:['connectors/individual/milvus/setup','connectors/individual/milvus/actions','connectors/individual/milvus/examples']},
                {type:'category',label:'Weaviate Vector Search',collapsed:true,link:{type:'doc',id:'connectors/individual/weaviate/overview'},items:['connectors/individual/weaviate/setup','connectors/individual/weaviate/actions','connectors/individual/weaviate/examples']},
                {type:'category',label:'Azure AI Search',collapsed:true,link:{type:'doc',id:'connectors/individual/azure-ai-search/overview'},items:['connectors/individual/azure-ai-search/setup','connectors/individual/azure-ai-search/actions','connectors/individual/azure-ai-search/examples']},
              ],
            },
            // ── Cloud & Infrastructure ──
            {
              type: 'category',
              label: 'Cloud & Infrastructure',
              link: {type: 'doc', id: 'connectors/cloud-services'},
              collapsed: true,
              items: [
                {type:'category',label:'Amazon S3',collapsed:true,link:{type:'doc',id:'connectors/individual/aws-s3/overview'},items:['connectors/individual/aws-s3/setup','connectors/individual/aws-s3/actions','connectors/individual/aws-s3/examples']},
                {type:'category',label:'Amazon DynamoDB',collapsed:true,link:{type:'doc',id:'connectors/individual/aws-dynamodb/overview'},items:['connectors/individual/aws-dynamodb/setup','connectors/individual/aws-dynamodb/actions','connectors/individual/aws-dynamodb/examples']},
                {type:'category',label:'AWS Lambda',collapsed:true,link:{type:'doc',id:'connectors/individual/aws-lambda/overview'},items:['connectors/individual/aws-lambda/setup','connectors/individual/aws-lambda/actions','connectors/individual/aws-lambda/examples']},
                {type:'category',label:'AWS Secrets Manager',collapsed:true,link:{type:'doc',id:'connectors/individual/aws-secretmanager/overview'},items:['connectors/individual/aws-secretmanager/setup','connectors/individual/aws-secretmanager/actions','connectors/individual/aws-secretmanager/examples']},
                {type:'category',label:'Azure Blob Storage',collapsed:true,link:{type:'doc',id:'connectors/individual/azure-storage/overview'},items:['connectors/individual/azure-storage/setup','connectors/individual/azure-storage/actions','connectors/individual/azure-storage/examples']},
                {type:'category',label:'Azure Cosmos DB',collapsed:true,link:{type:'doc',id:'connectors/individual/azure-cosmosdb/overview'},items:['connectors/individual/azure-cosmosdb/setup','connectors/individual/azure-cosmosdb/actions','connectors/individual/azure-cosmosdb/examples']},
                {type:'category',label:'Azure Event Hubs',collapsed:true,link:{type:'doc',id:'connectors/individual/azure-eventhub/overview'},items:['connectors/individual/azure-eventhub/setup','connectors/individual/azure-eventhub/actions','connectors/individual/azure-eventhub/examples']},
                {type:'category',label:'Azure Functions',collapsed:true,link:{type:'doc',id:'connectors/individual/azure-functions/overview'},items:['connectors/individual/azure-functions/setup','connectors/individual/azure-functions/actions','connectors/individual/azure-functions/examples']},
                {type:'category',label:'Azure Key Vault',collapsed:true,link:{type:'doc',id:'connectors/individual/azure-keyvault/overview'},items:['connectors/individual/azure-keyvault/setup','connectors/individual/azure-keyvault/actions','connectors/individual/azure-keyvault/examples']},
                {type:'category',label:'Azure Data Lake',collapsed:true,link:{type:'doc',id:'connectors/individual/azure-datalake/overview'},items:['connectors/individual/azure-datalake/setup','connectors/individual/azure-datalake/actions','connectors/individual/azure-datalake/examples']},
              ],
            },
            // ── Communication ──
            {
              type: 'category',
              label: 'Communication',
              link: {type: 'doc', id: 'connectors/communication'},
              collapsed: true,
              items: [
                {type:'category',label:'Twilio',collapsed:true,link:{type:'doc',id:'connectors/individual/twilio/overview'},items:['connectors/individual/twilio/setup','connectors/individual/twilio/actions','connectors/individual/twilio/examples']},
                {type:'category',label:'Twilio Trigger',collapsed:true,link:{type:'doc',id:'connectors/individual/trigger-twilio/overview'},items:['connectors/individual/trigger-twilio/setup','connectors/individual/trigger-twilio/triggers','connectors/individual/trigger-twilio/examples']},
                {type:'category',label:'SendGrid',collapsed:true,link:{type:'doc',id:'connectors/individual/sendgrid/overview'},items:['connectors/individual/sendgrid/setup','connectors/individual/sendgrid/actions','connectors/individual/sendgrid/examples']},
                {type:'category',label:'Amazon SES',collapsed:true,link:{type:'doc',id:'connectors/individual/aws-ses/overview'},items:['connectors/individual/aws-ses/setup','connectors/individual/aws-ses/actions','connectors/individual/aws-ses/examples']},
                {type:'category',label:'Vonage SMS',collapsed:true,link:{type:'doc',id:'connectors/individual/vonage-sms/overview'},items:['connectors/individual/vonage-sms/setup','connectors/individual/vonage-sms/actions','connectors/individual/vonage-sms/examples']},
              ],
            },
            // ── CRM & Sales ──
            {
              type: 'category',
              label: 'CRM & Sales',
              link: {type: 'doc', id: 'connectors/crm-sales'},
              collapsed: true,
              items: [
                {type:'category',label:'Salesforce',collapsed:true,link:{type:'doc',id:'connectors/individual/salesforce/overview'},items:['connectors/individual/salesforce/setup','connectors/individual/salesforce/actions','connectors/individual/salesforce/examples']},
                {type:'category',label:'Salesforce Trigger',collapsed:true,link:{type:'doc',id:'connectors/individual/trigger-salesforce/overview'},items:['connectors/individual/trigger-salesforce/setup','connectors/individual/trigger-salesforce/triggers','connectors/individual/trigger-salesforce/examples']},
                {type:'category',label:'HubSpot CRM',collapsed:true,link:{type:'doc',id:'connectors/individual/hubspot/overview'},items:['connectors/individual/hubspot/setup','connectors/individual/hubspot/actions','connectors/individual/hubspot/examples']},
                {type:'category',label:'ServiceNow',collapsed:true,link:{type:'doc',id:'connectors/individual/servicenow/overview'},items:['connectors/individual/servicenow/setup','connectors/individual/servicenow/actions','connectors/individual/servicenow/examples']},
                {type:'category',label:'Pipedrive',collapsed:true,link:{type:'doc',id:'connectors/individual/pipedrive/overview'},items:['connectors/individual/pipedrive/setup','connectors/individual/pipedrive/actions','connectors/individual/pipedrive/examples']},
                {type:'category',label:'ActiveCampaign',collapsed:true,link:{type:'doc',id:'connectors/individual/activecampaign/overview'},items:['connectors/individual/activecampaign/setup','connectors/individual/activecampaign/actions','connectors/individual/activecampaign/examples']},
              ],
            },
            // ── Database ──
            {
              type: 'category',
              label: 'Database',
              link: {type: 'doc', id: 'connectors/databases'},
              collapsed: true,
              items: [
                {type:'category',label:'MySQL',collapsed:true,link:{type:'doc',id:'connectors/individual/mysql/overview'},items:['connectors/individual/mysql/setup','connectors/individual/mysql/actions','connectors/individual/mysql/examples']},
                {type:'category',label:'PostgreSQL',collapsed:true,link:{type:'doc',id:'connectors/individual/postgresql/overview'},items:['connectors/individual/postgresql/setup','connectors/individual/postgresql/actions','connectors/individual/postgresql/examples']},
                {type:'category',label:'Microsoft SQL Server',collapsed:true,link:{type:'doc',id:'connectors/individual/mssql/overview'},items:['connectors/individual/mssql/setup','connectors/individual/mssql/actions','connectors/individual/mssql/examples']},
                {type:'category',label:'MongoDB',collapsed:true,link:{type:'doc',id:'connectors/individual/mongodb/overview'},items:['connectors/individual/mongodb/setup','connectors/individual/mongodb/actions','connectors/individual/mongodb/examples']},
                {type:'category',label:'Redis',collapsed:true,link:{type:'doc',id:'connectors/individual/redis/overview'},items:['connectors/individual/redis/setup','connectors/individual/redis/actions','connectors/individual/redis/examples']},
                {type:'category',label:'Oracle Database',collapsed:true,link:{type:'doc',id:'connectors/individual/oracledb/overview'},items:['connectors/individual/oracledb/setup','connectors/individual/oracledb/actions','connectors/individual/oracledb/examples']},
                {type:'category',label:'Snowflake',collapsed:true,link:{type:'doc',id:'connectors/individual/snowflake/overview'},items:['connectors/individual/snowflake/setup','connectors/individual/snowflake/actions','connectors/individual/snowflake/examples']},
                {type:'category',label:'JDBC (Generic)',collapsed:true,link:{type:'doc',id:'connectors/individual/java-jdbc/overview'},items:['connectors/individual/java-jdbc/setup','connectors/individual/java-jdbc/actions','connectors/individual/java-jdbc/examples']},
                {type:'category',label:'Change Data Capture',collapsed:true,link:{type:'doc',id:'connectors/individual/cdc/overview'},items:['connectors/individual/cdc/setup','connectors/individual/cdc/actions','connectors/individual/cdc/examples']},
                {type:'category',label:'Amazon Redshift',collapsed:true,link:{type:'doc',id:'connectors/individual/aws-redshift/overview'},items:['connectors/individual/aws-redshift/setup','connectors/individual/aws-redshift/actions','connectors/individual/aws-redshift/examples']},
              ],
            },
            // ── Developer Tools ──
            {
              type: 'category',
              label: 'Developer Tools',
              link: {type: 'doc', id: 'connectors/developer-tools'},
              collapsed: true,
              items: [
                {type:'category',label:'GitHub',collapsed:true,link:{type:'doc',id:'connectors/individual/github/overview'},items:['connectors/individual/github/setup','connectors/individual/github/actions','connectors/individual/github/examples']},
                {type:'category',label:'GitHub Trigger',collapsed:true,link:{type:'doc',id:'connectors/individual/trigger-github/overview'},items:['connectors/individual/trigger-github/setup','connectors/individual/trigger-github/triggers','connectors/individual/trigger-github/examples']},
                {type:'category',label:'Slack',collapsed:true,link:{type:'doc',id:'connectors/individual/slack/overview'},items:['connectors/individual/slack/setup','connectors/individual/slack/actions','connectors/individual/slack/examples']},
                {type:'category',label:'Slack Trigger',collapsed:true,link:{type:'doc',id:'connectors/individual/trigger-slack/overview'},items:['connectors/individual/trigger-slack/setup','connectors/individual/trigger-slack/triggers','connectors/individual/trigger-slack/examples']},
                {type:'category',label:'Jira',collapsed:true,link:{type:'doc',id:'connectors/individual/jira/overview'},items:['connectors/individual/jira/setup','connectors/individual/jira/actions','connectors/individual/jira/examples']},
                {type:'category',label:'Asana',collapsed:true,link:{type:'doc',id:'connectors/individual/asana/overview'},items:['connectors/individual/asana/setup','connectors/individual/asana/actions','connectors/individual/asana/examples']},
                {type:'category',label:'Trello',collapsed:true,link:{type:'doc',id:'connectors/individual/trello/overview'},items:['connectors/individual/trello/setup','connectors/individual/trello/actions','connectors/individual/trello/examples']},
              ],
            },
            // ── E-Commerce ──
            {
              type: 'category',
              label: 'E-Commerce',
              link: {type: 'doc', id: 'connectors/ecommerce'},
              collapsed: true,
              items: [
                {type:'category',label:'Shopify',collapsed:true,link:{type:'doc',id:'connectors/individual/shopify/overview'},items:['connectors/individual/shopify/setup','connectors/individual/shopify/actions','connectors/individual/shopify/examples']},
                {type:'category',label:'Shopify Trigger',collapsed:true,link:{type:'doc',id:'connectors/individual/trigger-shopify/overview'},items:['connectors/individual/trigger-shopify/setup','connectors/individual/trigger-shopify/triggers','connectors/individual/trigger-shopify/examples']},
                {type:'category',label:'Stripe',collapsed:true,link:{type:'doc',id:'connectors/individual/stripe/overview'},items:['connectors/individual/stripe/setup','connectors/individual/stripe/actions','connectors/individual/stripe/examples']},
                {type:'category',label:'PayPal',collapsed:true,link:{type:'doc',id:'connectors/individual/paypal/overview'},items:['connectors/individual/paypal/setup','connectors/individual/paypal/actions','connectors/individual/paypal/examples']},
                {type:'category',label:'Eventbrite',collapsed:true,link:{type:'doc',id:'connectors/individual/eventbrite/overview'},items:['connectors/individual/eventbrite/setup','connectors/individual/eventbrite/actions','connectors/individual/eventbrite/examples']},
              ],
            },
            // ── Enterprise (ERP/Business) ──
            {
              type: 'category',
              label: 'Enterprise (ERP/Business)',
              link: {type: 'doc', id: 'connectors/erp-business'},
              collapsed: true,
              items: [
                {type:'category',label:'SAP',collapsed:true,link:{type:'doc',id:'connectors/individual/sap/overview'},items:['connectors/individual/sap/setup','connectors/individual/sap/actions','connectors/individual/sap/examples']},
                {type:'category',label:'SAP JCo',collapsed:true,link:{type:'doc',id:'connectors/individual/sap-jco/overview'},items:['connectors/individual/sap-jco/setup','connectors/individual/sap-jco/actions','connectors/individual/sap-jco/examples']},
                {type:'category',label:'Oracle NetSuite',collapsed:true,link:{type:'doc',id:'connectors/individual/netsuite/overview'},items:['connectors/individual/netsuite/setup','connectors/individual/netsuite/actions','connectors/individual/netsuite/examples']},
              ],
            },
            // ── Finance & Accounting ──
            {
              type: 'category',
              label: 'Finance & Accounting',
              link: {type: 'doc', id: 'connectors/finance-accounting'},
              collapsed: true,
              items: [
                {type:'category',label:'QuickBooks',collapsed:true,link:{type:'doc',id:'connectors/individual/quickbooks/overview'},items:['connectors/individual/quickbooks/setup','connectors/individual/quickbooks/actions','connectors/individual/quickbooks/examples']},
                {type:'category',label:'Xero',collapsed:true,link:{type:'doc',id:'connectors/individual/xero/overview'},items:['connectors/individual/xero/setup','connectors/individual/xero/actions','connectors/individual/xero/examples']},
                {type:'category',label:'SWIFT MT Messages',collapsed:true,link:{type:'doc',id:'connectors/individual/financial-swift-mt/overview'},items:['connectors/individual/financial-swift-mt/setup','connectors/individual/financial-swift-mt/actions','connectors/individual/financial-swift-mt/examples']},
                {type:'category',label:'ISO 20022',collapsed:true,link:{type:'doc',id:'connectors/individual/financial-iso20022/overview'},items:['connectors/individual/financial-iso20022/setup','connectors/individual/financial-iso20022/actions','connectors/individual/financial-iso20022/examples']},
              ],
            },
            // ── Healthcare ──
            {
              type: 'category',
              label: 'Healthcare',
              link: {type: 'doc', id: 'connectors/healthcare'},
              collapsed: true,
              items: [],
            },
            // ── HRMS ──
            {
              type: 'category',
              label: 'HRMS',
              link: {type: 'doc', id: 'connectors/hrms'},
              collapsed: true,
              items: [
                {type:'category',label:'SCIM',collapsed:true,link:{type:'doc',id:'connectors/individual/scim/overview'},items:['connectors/individual/scim/setup','connectors/individual/scim/actions','connectors/individual/scim/examples']},
                {type:'category',label:'Zoho People',collapsed:true,link:{type:'doc',id:'connectors/individual/zoho-people/overview'},items:['connectors/individual/zoho-people/setup','connectors/individual/zoho-people/actions','connectors/individual/zoho-people/examples']},
                {type:'category',label:'PeopleHR',collapsed:true,link:{type:'doc',id:'connectors/individual/peoplehr/overview'},items:['connectors/individual/peoplehr/setup','connectors/individual/peoplehr/actions','connectors/individual/peoplehr/examples']},
              ],
            },
            // ── Marketing & Social ──
            {
              type: 'category',
              label: 'Marketing & Social',
              link: {type: 'doc', id: 'connectors/marketing-social'},
              collapsed: true,
              items: [
                {type:'category',label:'Mailchimp',collapsed:true,link:{type:'doc',id:'connectors/individual/mailchimp/overview'},items:['connectors/individual/mailchimp/setup','connectors/individual/mailchimp/actions','connectors/individual/mailchimp/examples']},
                {type:'category',label:'Twitter/X',collapsed:true,link:{type:'doc',id:'connectors/individual/twitter/overview'},items:['connectors/individual/twitter/setup','connectors/individual/twitter/actions','connectors/individual/twitter/examples']},
                {type:'category',label:'Spotify',collapsed:true,link:{type:'doc',id:'connectors/individual/spotify/overview'},items:['connectors/individual/spotify/setup','connectors/individual/spotify/actions','connectors/individual/spotify/examples']},
              ],
            },
            // ── Messaging ──
            {
              type: 'category',
              label: 'Messaging',
              link: {type: 'doc', id: 'connectors/messaging'},
              collapsed: true,
              items: [
                {type:'category',label:'Apache Kafka',collapsed:true,link:{type:'doc',id:'connectors/individual/kafka/overview'},items:['connectors/individual/kafka/setup','connectors/individual/kafka/actions','connectors/individual/kafka/examples']},
                {type:'category',label:'RabbitMQ',collapsed:true,link:{type:'doc',id:'connectors/individual/rabbitmq/overview'},items:['connectors/individual/rabbitmq/setup','connectors/individual/rabbitmq/actions','connectors/individual/rabbitmq/examples']},
                {type:'category',label:'NATS',collapsed:true,link:{type:'doc',id:'connectors/individual/nats/overview'},items:['connectors/individual/nats/setup','connectors/individual/nats/actions','connectors/individual/nats/examples']},
                {type:'category',label:'Azure Service Bus',collapsed:true,link:{type:'doc',id:'connectors/individual/asb/overview'},items:['connectors/individual/asb/setup','connectors/individual/asb/actions','connectors/individual/asb/examples']},
                {type:'category',label:'Azure Service Bus Trigger',collapsed:true,link:{type:'doc',id:'connectors/individual/trigger-asb/overview'},items:['connectors/individual/trigger-asb/setup','connectors/individual/trigger-asb/triggers','connectors/individual/trigger-asb/examples']},
                {type:'category',label:'Amazon SQS',collapsed:true,link:{type:'doc',id:'connectors/individual/aws-sqs/overview'},items:['connectors/individual/aws-sqs/setup','connectors/individual/aws-sqs/actions','connectors/individual/aws-sqs/examples']},
                {type:'category',label:'Amazon SNS',collapsed:true,link:{type:'doc',id:'connectors/individual/aws-sns/overview'},items:['connectors/individual/aws-sns/setup','connectors/individual/aws-sns/actions','connectors/individual/aws-sns/examples']},
                {type:'category',label:'Google Cloud Pub/Sub',collapsed:true,link:{type:'doc',id:'connectors/individual/gcloud-pubsub/overview'},items:['connectors/individual/gcloud-pubsub/setup','connectors/individual/gcloud-pubsub/actions','connectors/individual/gcloud-pubsub/examples']},
                {type:'category',label:'Java JMS',collapsed:true,link:{type:'doc',id:'connectors/individual/java-jms/overview'},items:['connectors/individual/java-jms/setup','connectors/individual/java-jms/actions','connectors/individual/java-jms/examples']},
                {type:'category',label:'IBM MQ',collapsed:true,link:{type:'doc',id:'connectors/individual/ibm-mq/overview'},items:['connectors/individual/ibm-mq/setup','connectors/individual/ibm-mq/actions','connectors/individual/ibm-mq/examples']},
                {type:'category',label:'Solace PubSub+',collapsed:true,link:{type:'doc',id:'connectors/individual/solace/overview'},items:['connectors/individual/solace/setup','connectors/individual/solace/actions','connectors/individual/solace/examples']},
              ],
            },
            // ── Productivity & Collaboration ──
            {
              type: 'category',
              label: 'Productivity & Collaboration',
              link: {type: 'doc', id: 'connectors/productivity-collaboration'},
              collapsed: true,
              items: [
                {type:'category',label:'Google Sheets',collapsed:true,link:{type:'doc',id:'connectors/individual/google-sheets/overview'},items:['connectors/individual/google-sheets/setup','connectors/individual/google-sheets/actions','connectors/individual/google-sheets/examples']},
                {type:'category',label:'Google Sheets Trigger',collapsed:true,link:{type:'doc',id:'connectors/individual/trigger-google-sheets/overview'},items:['connectors/individual/trigger-google-sheets/setup','connectors/individual/trigger-google-sheets/triggers','connectors/individual/trigger-google-sheets/examples']},
                {type:'category',label:'Gmail',collapsed:true,link:{type:'doc',id:'connectors/individual/google-gmail/overview'},items:['connectors/individual/google-gmail/setup','connectors/individual/google-gmail/actions','connectors/individual/google-gmail/examples']},
                {type:'category',label:'Gmail Trigger',collapsed:true,link:{type:'doc',id:'connectors/individual/trigger-google-mail/overview'},items:['connectors/individual/trigger-google-mail/setup','connectors/individual/trigger-google-mail/triggers','connectors/individual/trigger-google-mail/examples']},
                {type:'category',label:'Google Calendar',collapsed:true,link:{type:'doc',id:'connectors/individual/google-calendar/overview'},items:['connectors/individual/google-calendar/setup','connectors/individual/google-calendar/actions','connectors/individual/google-calendar/examples']},
                {type:'category',label:'Google Calendar Trigger',collapsed:true,link:{type:'doc',id:'connectors/individual/trigger-google-calendar/overview'},items:['connectors/individual/trigger-google-calendar/setup','connectors/individual/trigger-google-calendar/triggers','connectors/individual/trigger-google-calendar/examples']},
                {type:'category',label:'Google Drive',collapsed:true,link:{type:'doc',id:'connectors/individual/google-drive/overview'},items:['connectors/individual/google-drive/setup','connectors/individual/google-drive/actions','connectors/individual/google-drive/examples']},
                {type:'category',label:'Google Drive Trigger',collapsed:true,link:{type:'doc',id:'connectors/individual/trigger-google-drive/overview'},items:['connectors/individual/trigger-google-drive/setup','connectors/individual/trigger-google-drive/triggers','connectors/individual/trigger-google-drive/examples']},
                {type:'category',label:'Google People',collapsed:true,link:{type:'doc',id:'connectors/individual/google-people/overview'},items:['connectors/individual/google-people/setup','connectors/individual/google-people/actions','connectors/individual/google-people/examples']},
                {type:'category',label:'Microsoft Teams',collapsed:true,link:{type:'doc',id:'connectors/individual/microsoft-teams/overview'},items:['connectors/individual/microsoft-teams/setup','connectors/individual/microsoft-teams/actions','connectors/individual/microsoft-teams/examples']},
                {type:'category',label:'Microsoft OneDrive',collapsed:true,link:{type:'doc',id:'connectors/individual/microsoft-onedrive/overview'},items:['connectors/individual/microsoft-onedrive/setup','connectors/individual/microsoft-onedrive/actions','connectors/individual/microsoft-onedrive/examples']},
                {type:'category',label:'Microsoft Excel',collapsed:true,link:{type:'doc',id:'connectors/individual/microsoft-excel/overview'},items:['connectors/individual/microsoft-excel/setup','connectors/individual/microsoft-excel/actions','connectors/individual/microsoft-excel/examples']},
                {type:'category',label:'Microsoft Outlook',collapsed:true,link:{type:'doc',id:'connectors/individual/microsoft-outlook/overview'},items:['connectors/individual/microsoft-outlook/setup','connectors/individual/microsoft-outlook/actions','connectors/individual/microsoft-outlook/examples']},
                {type:'category',label:'Zoom',collapsed:true,link:{type:'doc',id:'connectors/individual/zoom/overview'},items:['connectors/individual/zoom/setup','connectors/individual/zoom/actions','connectors/individual/zoom/examples']},
                {type:'category',label:'DocuSign',collapsed:true,link:{type:'doc',id:'connectors/individual/docusign/overview'},items:['connectors/individual/docusign/setup','connectors/individual/docusign/actions','connectors/individual/docusign/examples']},
              ],
            },
            // ── Security & Identity ──
            {
              type: 'category',
              label: 'Security & Identity',
              link: {type: 'doc', id: 'connectors/security-identity'},
              collapsed: true,
              items: [],
            },
            // ── Storage & File Management ──
            {
              type: 'category',
              label: 'Storage & File Management',
              link: {type: 'doc', id: 'connectors/file-storage'},
              collapsed: true,
              items: [],
            },
          ],
        },
        // ── Using Connectors ──
        {
          type: 'category',
          label: 'Using Connectors',
          items: [
            'connectors/authentication',
            'connectors/configuration',
            'connectors/error-handling',
            'connectors/protocols',
            'connectors/data-formats-standards',
            'connectors/ballerina-libraries',
          ],
        },
        // ── Build Your Own ──
        {
          type: 'category',
          label: 'Build Your Own',
          items: [
            'connectors/custom-development',
            'connectors/create-from-openapi',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // GENAI
    // "How do I build AI agents, RAG, or MCP?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'GenAI',
      link: {type: 'doc', id: 'genai/index'},
      items: [
        // Getting Started
        {
          type: 'category',
          label: 'Getting Started',
          items: [
            'genai/getting-started/setup',
            {
              type: 'category',
              label: 'Building Your First AI Integration',
              items: [
                'genai/getting-started/smart-calculator',
                'genai/getting-started/hotel-booking-agent',
              ],
            },
          ],
        },
        // Key Concepts
        {
          type: 'category',
          label: 'Key Concepts',
          items: [
            'genai/key-concepts/what-is-llm',
            'genai/key-concepts/what-is-natural-function',
            'genai/key-concepts/what-is-ai-agent',
            'genai/key-concepts/what-are-tools',
            'genai/key-concepts/what-is-agent-memory',
            'genai/key-concepts/what-is-mcp',
            'genai/key-concepts/what-is-rag',
          ],
        },
        // Develop AI Applications
        {
          type: 'category',
          label: 'Develop AI Applications',
          items: [
            // Direct LLM Calls
            {
              type: 'category',
              label: 'Direct LLM Calls',
              items: [
                'genai/develop/direct-llm/configuring-providers',
                'genai/develop/direct-llm/constructing-prompts',
                'genai/develop/direct-llm/handling-responses',
              ],
            },
            // Natural Functions
            {
              type: 'category',
              label: 'Natural Functions',
              items: [
                'genai/develop/natural-functions/defining',
                'genai/develop/natural-functions/constructing-prompts',
                'genai/develop/natural-functions/handling-responses',
              ],
            },
            // RAG
            {
              type: 'category',
              label: 'RAG',
              items: [
                {
                  type: 'category',
                  label: 'RAG Ingestion',
                  items: [
                    'genai/develop/rag/chunking-documents',
                    'genai/develop/rag/generating-embeddings',
                    'genai/develop/rag/connecting-vector-dbs',
                  ],
                },
                'genai/develop/rag/rag-querying',
              ],
            },
            // AI Agents
            {
              type: 'category',
              label: 'AI Agents',
              items: [
                'genai/develop/agents/creating-agent',
                'genai/develop/agents/adding-tools',
                'genai/develop/agents/adding-memory',
                'genai/develop/agents/advanced-config',
                'genai/develop/agents/agent-observability',
                'genai/develop/agents/agent-evaluations',
              ],
            },
            // MCP Integration
            {
              type: 'category',
              label: 'MCP Integration',
              items: [
                'genai/develop/mcp/creating-mcp-server',
                'genai/develop/mcp/agents-with-mcp',
              ],
            },
          ],
        },
        // Deep Dives — Agents
        {
          type: 'category',
          label: 'Agents',
          items: [
            'genai/agents/architecture-concepts',
            'genai/agents/chat-agents',
            'genai/agents/api-exposed-agents',
            'genai/agents/natural-functions',
            'genai/agents/tool-binding',
            'genai/agents/memory-configuration',
            'genai/agents/multi-agent-orchestration',
          ],
        },
        // Deep Dives — RAG
        {
          type: 'category',
          label: 'RAG',
          items: [
            'genai/rag/architecture-overview',
            'genai/rag/document-ingestion',
            'genai/rag/chunking-embedding',
            'genai/rag/vector-databases',
            'genai/rag/building-rag-service',
          ],
        },
        // Deep Dives — MCP
        {
          type: 'category',
          label: 'MCP',
          items: [
            'genai/mcp/overview',
            'genai/mcp/consuming-mcp-tools',
            'genai/mcp/exposing-mcp-servers',
            'genai/mcp/mcp-security',
          ],
        },
        // LLM Connectivity
        {
          type: 'category',
          label: 'LLM Connectivity',
          items: [
            'genai/llm-connectivity/model-selection',
            'genai/llm-connectivity/prompt-engineering',
            'genai/llm-connectivity/managing-context-windows',
            'genai/llm-connectivity/natural-expressions',
            'genai/llm-connectivity/streaming-responses',
          ],
        },
        // Guardrails
        {
          type: 'category',
          label: 'Guardrails',
          items: [
            'genai/guardrails/responsible-ai',
            'genai/guardrails/content-filtering',
            'genai/guardrails/input-output-guardrails',
            'genai/guardrails/token-cost-management',
            'genai/guardrails/ai-usage-guidelines',
          ],
        },
        // Agent Observability
        {
          type: 'category',
          label: 'Agent Observability',
          items: [
            'genai/agent-observability/agent-tracing',
            'genai/agent-observability/conversation-logging',
            'genai/agent-observability/performance-metrics',
            'genai/agent-observability/debugging-agent-behavior',
          ],
        },
        // Quick Starts
        {
          type: 'category',
          label: 'Quick Starts',
          items: [
            'genai/quick-starts/build-conversational-agent',
            'genai/quick-starts/build-rag-application',
            'genai/quick-starts/expose-mcp-server',
          ],
        },
        // Tutorials
        {
          type: 'category',
          label: 'Tutorials',
          items: [
            'genai/tutorials/hr-knowledge-base-rag',
            'genai/tutorials/customer-care-mcp',
            'genai/tutorials/it-helpdesk-chatbot',
            'genai/tutorials/legal-doc-qa',
            'genai/tutorials/ai-customer-support',
            'genai/tutorials/conversational-data-pipeline',
            'genai/tutorials/mcp-enterprise-data',
            'genai/tutorials/multi-agent-workflow',
            'genai/tutorials/rag-knowledge-base',
          ],
        },
        // Reference
        {
          type: 'category',
          label: 'Reference',
          items: [
            'genai/reference/copilot-guide',
            'genai/reference/ai-governance',
            'genai/reference/troubleshooting',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // TUTORIALS
    // "Show me a complete, real example"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Tutorials',
      link: {type: 'doc', id: 'tutorials/index'},
      items: [
        // Walkthroughs
        {
          type: 'category',
          label: 'Walkthroughs',
          items: [
            'tutorials/salesforce-db-sync',
            'tutorials/kafka-event-pipeline',
            'tutorials/rest-api-aggregation',
            'tutorials/walkthroughs/content-based-routing',
            'tutorials/walkthroughs/data-transformation-pipeline',
            'tutorials/file-batch-etl',
            'tutorials/walkthroughs/email-notification-service',
            'tutorials/walkthroughs/cdc-service',
            'tutorials/healthcare-hl7-fhir',
            'tutorials/walkthroughs/edi-ftp-processing',
            'tutorials/data-reconciliation',
          ],
        },
        // Enterprise Integration Patterns (EIP)
        {
          type: 'category',
          label: 'Enterprise Integration Patterns',
          items: [
            'tutorials/patterns/content-based-router',
            'tutorials/patterns/message-filter',
            'tutorials/patterns/scatter-gather',
            'tutorials/patterns/recipient-list',
            'tutorials/patterns/message-translator',
            'tutorials/patterns/circuit-breaker',
            'tutorials/patterns/saga-compensation',
            'tutorials/patterns/publish-subscribe',
            'tutorials/patterns/guaranteed-delivery',
            'tutorials/patterns/idempotent-receiver',
            'tutorials/patterns/api-gateway-orchestration',
            'tutorials/patterns/agent-tool-orchestration',
            'tutorials/patterns/rag-pipeline',
          ],
        },
        // Pre-Built Integration Samples
        {
          type: 'category',
          label: 'Pre-Built Integration Samples',
          link: {type: 'doc', id: 'tutorials/pre-built/index'},
          items: [
            'tutorials/pre-built/google-sheets-salesforce',
            'tutorials/pre-built/github-email-summary',
            'tutorials/pre-built/google-drive-onedrive',
            'tutorials/pre-built/mysql-salesforce-products',
            'tutorials/pre-built/gmail-salesforce-leads',
            'tutorials/pre-built/kafka-salesforce-pricebook',
            'tutorials/pre-built/salesforce-twilio-sms',
            'tutorials/pre-built/hubspot-google-contacts',
            'tutorials/pre-built/ftp-edi-salesforce',
            'tutorials/pre-built/shopify-outlook-email',
          ],
        },
        // Sample Projects
        {
          type: 'category',
          label: 'Sample Projects',
          link: {type: 'doc', id: 'tutorials/samples/index'},
          items: [
            'tutorials/samples/hospital-service',
            'tutorials/samples/ecommerce-order-service',
            'tutorials/samples/event-driven-microservices',
            'tutorials/samples/data-service-persist',
            'tutorials/samples/restful-api-data-mapper',
            'tutorials/samples/ai-personal-assistant',
          ],
        },
        // Migration Guides
        {
          type: 'category',
          label: 'Migration Guides',
          items: [
            'tutorials/migration/from-wso2-mi',
            'tutorials/migration/from-mulesoft',
            'tutorials/migration/from-tibco',
            'tutorials/migration/from-boomi',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // DEPLOY & OPERATE
    // "How do I ship, run, and secure this?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Deploy & Operate',
      link: {type: 'doc', id: 'deploy-operate/index'},
      items: [
        // Deploy
        {
          type: 'category',
          label: 'Deploy',
          items: [
            'deploy-operate/deploy/local',
            'deploy-operate/deploy/vm-based',
            'deploy-operate/deploy/docker-kubernetes',
            'deploy-operate/deploy/openshift',
            'deploy-operate/deploy/serverless',
            'deploy-operate/deploy/devant',
            'deploy-operate/deploy/cloud-providers',
            'deploy-operate/deploy/graalvm',
            'deploy-operate/deploy/environments',
            'deploy-operate/deploy/managing-configurations',
            'deploy-operate/deploy/scaling-ha',
          ],
        },
        // CI/CD
        {
          type: 'category',
          label: 'CI/CD',
          items: [
            'deploy-operate/cicd/github-actions',
            'deploy-operate/cicd/jenkins',
            'deploy-operate/cicd/gitlab',
            'deploy-operate/cicd/azure-devops',
          ],
        },
        // Observe
        {
          type: 'category',
          label: 'Observe',
          link: {type: 'doc', id: 'deploy-operate/observe/index'},
          items: [
            'deploy-operate/observe/logging',
            'deploy-operate/observe/metrics',
            'deploy-operate/observe/tracing',
            'deploy-operate/observe/icp',
            'deploy-operate/observe/devant',
            'deploy-operate/observe/prometheus',
            'deploy-operate/observe/grafana',
            'deploy-operate/observe/jaeger',
            'deploy-operate/observe/zipkin',
            'deploy-operate/observe/datadog',
            'deploy-operate/observe/new-relic',
            'deploy-operate/observe/elastic',
            'deploy-operate/observe/opensearch',
            'deploy-operate/observe/moesif',
            'deploy-operate/observe/third-party',
          ],
        },
        // Secure
        {
          type: 'category',
          label: 'Secure',
          items: [
            'deploy-operate/secure/runtime-security',
            'deploy-operate/secure/authentication',
            'deploy-operate/secure/api-security',
            'deploy-operate/secure/secrets-encryption',
            'deploy-operate/secure/ip-whitelisting',
            'deploy-operate/secure/compliance',
          ],
        },
        // Capacity Planning
        {
          type: 'category',
          label: 'Capacity Planning',
          link: {type: 'doc', id: 'deploy-operate/capacity-planning/index'},
          items: [
            'deploy-operate/capacity-planning/performance-reports',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // REFERENCE
    // "What's the exact syntax / config / API for Z?"
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: 'Reference',
      link: {type: 'doc', id: 'reference/index'},
      items: [
        // Language
        {
          type: 'category',
          label: 'Language',
          items: [
            'reference/language/syntax',
            'reference/language/type-system',
            'reference/language/stdlib',
            'reference/language/query-expressions',
            'reference/language/concurrency',
            'reference/language/error-handling',
            'reference/language/integration-features',
          ],
        },
        // Configuration
        {
          type: 'category',
          label: 'Configuration',
          items: [
            'reference/config/ballerina-toml',
            'reference/config/config-toml',
            'reference/config/cloud-toml',
            'reference/config/dependencies-toml',
            'reference/config/environment-variables',
          ],
        },
        // CLI
        {
          type: 'category',
          label: 'CLI',
          items: [
            'reference/cli/bal-commands',
            'reference/cli/bal-persist',
            'reference/cli/bal-openapi',
            'reference/cli/bal-graphql',
            'reference/cli/bal-grpc',
            'reference/cli/bal-edi',
            'reference/cli/bal-health',
            'reference/cli/update-tool',
            'reference/cli/scan-tool',
          ],
        },
        // APIs
        {
          type: 'category',
          label: 'APIs',
          items: [
            'reference/api/management-api',
            'reference/api/icp-api',
            'reference/api/ballerina-api-docs',
          ],
        },
        'reference/protocols',
        'reference/data-formats',
        'reference/by-example',
        'reference/specifications',
        // Appendix
        {
          type: 'category',
          label: 'Appendix',
          items: [
            'reference/appendix/system-requirements',
            'reference/error-codes',
            'reference/glossary',
            'reference/faq',
            'reference/appendix/troubleshooting',
            'reference/release-notes',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
