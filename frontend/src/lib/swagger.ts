import { createSwaggerSpec } from 'next-swagger-doc';
import path from 'path';

const apiDirectory = path.join(process.cwd(), 'src/app/api');

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ZHSF AI claims reconciliation api',
        version: '1.0.0',
        description: 'api documentation for the AI-powered claims reconciliation system',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      paths: {
        '/api/webhook': {
          post: {
            summary: 'send a message to the AI assistant',
            description: 'processes text messages or file uploads and forwards to n8n workflow for AI processing. supports three main scenarios: RAG (rules engine validation), OCR (rules engine validation or conversion to text), and MCP (AI claims reconciliation with tools). thread is always new.',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['message'],
                    properties: {
                      message: {
                        type: 'string',
                        description: 'the text message to send',
                      },
                      mcp_is_on: {
                        type: 'boolean',
                        description: 'enable MCP mode',
                      },
                    },
                  },
                  examples: {
                    'RAG Scenario': {
                      summary: 'RAG - rules engine validation: send text for rules-based validation and processing',
                      value: {
                        message: 'please validate this claim against our rules: claim amount $5000, service date 2024-01-15',
                      },
                    },
                    'MCP Scenario': {
                      summary: 'MCP - AI claims reconciliation with tools: send text with AI tools enabled for advanced analysis',
                      value: {
                        message: 'analyze this claim for discrepancies and suggest corrections',
                        mcp_is_on: true,
                      },
                    },
                  },
                },
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    required: ['message'],
                    properties: {
                      message: {
                        type: 'string',
                        description: 'the text message to send',
                      },
                      mcp_is_on: {
                        type: 'string',
                        enum: ['true', 'false'],
                        description: 'enable MCP mode',
                      },
                      file: {
                        type: 'string',
                        format: 'binary',
                        description: 'file to upload (optional)',
                      },
                      attachmentName: {
                        type: 'string',
                        description: 'name of the attachment',
                      },
                    },
                  },
                  examples: {
                    'OCR Scenario': {
                      summary: 'OCR - rules engine validation or conversion to text: upload image/document for OCR processing and rules validation',
                      value: {
                        message: 'please extract and validate the claim information from this document',
                        mcp_is_on: 'false',
                        file: '<binary data>',
                        attachmentName: 'claim.pdf',
                      },
                    },
                    'OCR + MCP Scenario': {
                      summary: 'OCR + MCP - combined OCR processing with AI tools: upload image and enable AI reconciliation tools',
                      value: {
                        message: 'extract claim data from this image and perform AI-powered reconciliation analysis',
                        mcp_is_on: 'true',
                        file: '<binary data>',
                        attachmentName: 'claim.jpg',
                      },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: 'successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: {
                          type: 'boolean',
                          example: true,
                        },
                        thread_id: {
                          type: 'string',
                          description: 'the thread ID for the conversation',
                          example: 'thread_123456',
                        },
                        response: {
                          type: 'object',
                          description: 'the AI response',
                          example: { text: 'Your claim has been processed.' },
                        },
                        has_file: {
                          type: 'boolean',
                          description: 'whether a file was included',
                          example: false,
                        },
                      },
                    },
                  },
                },
              },
              400: {
                description: 'bad request',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        error: {
                          type: 'string',
                          example: 'Message is required',
                        },
                      },
                    },
                  },
                },
              },
              500: {
                description: 'internal server error',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        error: {
                          type: 'string',
                          example: 'internal server error',
                        },
                        details: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    apiFolder: apiDirectory,
    schemaFolders: [],
  });
  return spec;
};
