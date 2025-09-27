
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/auth/login": {
        "post": {
          "operationId": "AuthController_userRegister",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserLoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successfully Registered",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserDto"
                  }
                }
              }
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_getCurrentUser",
          "parameters": [],
          "responses": {
            "200": {
              "description": "current user info",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "auth"
          ]
        }
      },
      "/health": {
        "get": {
          "operationId": "HealthCheckerController_check",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The Health Check is successful",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "string",
                        "example": "ok"
                      },
                      "info": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        },
                        "nullable": true
                      },
                      "error": {
                        "type": "object",
                        "example": {},
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        },
                        "nullable": true
                      },
                      "details": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        }
                      }
                    }
                  }
                }
              }
            },
            "503": {
              "description": "The Health Check is not successful",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "string",
                        "example": "error"
                      },
                      "info": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        },
                        "nullable": true
                      },
                      "error": {
                        "type": "object",
                        "example": {
                          "redis": {
                            "status": "down",
                            "message": "Could not connect"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        },
                        "nullable": true
                      },
                      "details": {
                        "type": "object",
                        "example": {
                          "database": {
                            "status": "up"
                          },
                          "redis": {
                            "status": "down",
                            "message": "Could not connect"
                          }
                        },
                        "additionalProperties": {
                          "type": "object",
                          "required": [
                            "status"
                          ],
                          "properties": {
                            "status": {
                              "type": "string"
                            }
                          },
                          "additionalProperties": true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "HealthChecker"
          ]
        }
      },
      "/holoo/product": {
        "get": {
          "operationId": "HolooController_getProduct",
          "parameters": [
            {
              "name": "name",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "code",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "erpcode",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "get product  \n note: at least one of this parameters should send: {name: string, code: string,erpcode: string}",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/HolooProductDto"
                  }
                }
              }
            }
          },
          "tags": [
            "holoo"
          ]
        }
      },
      "/holoo/preInvoice": {
        "post": {
          "operationId": "HolooController_addPreInvoice",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePreInvoiceDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "holoo"
          ]
        }
      },
      "/holoo/filterCustomer": {
        "get": {
          "operationId": "HolooController_filterCustomer",
          "parameters": [
            {
              "name": "phone",
              "required": false,
              "in": "query",
              "description": "user phone number",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "name",
              "required": false,
              "in": "query",
              "description": "name of user",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "filter Customers",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/HolooCustomerDto"
                  }
                }
              }
            }
          },
          "tags": [
            "holoo"
          ]
        }
      },
      "/holoo/Customer": {
        "get": {
          "operationId": "HolooController_getCustomers",
          "parameters": [
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "min": 1,
              "max": 100,
              "schema": {
                "minimum": 1,
                "maximum": 100,
                "default": 50,
                "type": "number"
              }
            },
            {
              "name": "page",
              "required": false,
              "in": "query",
              "min": 1,
              "schema": {
                "minimum": 1,
                "default": 1,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "get customers by pagination. default is page 1 and limit 50",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/HolooCustomerDto"
                  }
                }
              }
            }
          },
          "tags": [
            "holoo"
          ]
        }
      },
      "/holoo/costumerAddress": {
        "get": {
          "operationId": "HolooController_getCostumerAddress",
          "parameters": [
            {
              "name": "customerErpCode",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "get addresses"
            }
          },
          "tags": [
            "holoo"
          ]
        }
      },
      "/holoo/sellers": {
        "get": {
          "operationId": "HolooController_getSellers",
          "parameters": [],
          "responses": {
            "200": {
              "description": "get verified sellers in system"
            }
          },
          "tags": [
            "holoo"
          ]
        }
      }
    },
    "info": {
      "title": "API",
      "description": "### REST\n\nRoutes is following REST standard (Richardson level 3)\n\n<details><summary>Detailed specification</summary>\n<p>\n\n**List:**\n  - `GET /<resources>/`\n    - Get the list of **<resources>** as admin\n  - `GET /user/<user_id>/<resources>/`\n    - Get the list of **<resources>** for a given **<user_id>**\n    - Output a **403** if logged user is not **<user_id>**\n\n**Detail:**\n  - `GET /<resources>/<resource_id>`\n    - Get the detail for **<resources>** of id **<resource_id>**\n    - Output a **404** if not found\n  - `GET /user/<user_id>/<resources>/<resource_id>`\n    - Get the list of **<resources>** for a given **user_id**\n    - Output a **404** if not found\n    - Output a **403** if:\n      - Logged user is not **<user_id>**\n      - The **<user_id>** have no access to **<resource_id>**\n\n**Creation / Edition / Replacement / Suppression:**\n  - `<METHOD>` is:\n    - **POST** for creation\n    - **PATCH** for update (one or more fields)\n    - **PUT** for replacement (all fields, not used)\n    - **DELETE** for suppression (all fields, not used)\n  - `<METHOD> /<resources>/<resource_id>`\n    - Create **<resources>** with id **<resource_id>** as admin\n    - Output a **400** if **<resource_id>** conflicts with existing **<resources>**\n  - `<METHOD> /user/<user_id>/<resources>/<resource_id>`\n    - Create **<resources>** with id **<resource_id>** as a given **user_id**\n    - Output a **409** if **<resource_id>** conflicts with existing **<resources>**\n    - Output a **403** if:\n      - Logged user is not **<user_id>**\n      - The **<user_id>** have no access to **<resource_id>**\n</p>\n</details>",
      "version": "v1.0.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "UserLoginDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "toLowerCase": true
            },
            "username": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "password"
          ]
        },
        "Gender": {
          "type": "number",
          "enum": [
            1,
            2
          ]
        },
        "UserDto": {
          "type": "object",
          "properties": {
            "uuid": {
              "type": "string",
              "format": "uuid"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            },
            "updatedAt": {
              "format": "date-time",
              "type": "string"
            },
            "first_name": {
              "type": "string"
            },
            "last_name": {
              "type": "string"
            },
            "national_code": {
              "type": "string"
            },
            "phone": {
              "type": "string"
            },
            "phone_verified_at": {
              "format": "date-time",
              "type": "string"
            },
            "email": {
              "type": "string",
              "toLowerCase": true
            },
            "email_verified_at": {
              "format": "date-time",
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "gender": {
              "allOf": [
                {
                  "$ref": "#/components/schemas/Gender"
                }
              ]
            },
            "store_info": {
              "type": "string"
            }
          },
          "required": [
            "uuid",
            "createdAt",
            "updatedAt"
          ]
        },
        "HolooProductDto": {
          "type": "object",
          "properties": {}
        },
        "ProductInfo": {
          "type": "object",
          "properties": {
            "product_variant_erpcode": {
              "type": "string",
              "description": "product ErpCode"
            },
            "quantity": {
              "type": "number"
            },
            "price": {
              "type": "number"
            }
          },
          "required": [
            "product_variant_erpcode",
            "quantity",
            "price"
          ]
        },
        "CreatePreInvoiceDto": {
          "type": "object",
          "properties": {
            "productInfo": {
              "description": "array of product infos with this fields => {product_variant_erpcode : string\nquantity: number\nprice: number}",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ProductInfo"
              }
            },
            "costumerErpCode": {
              "type": "string"
            },
            "discountPercent": {
              "type": "string"
            }
          },
          "required": [
            "productInfo",
            "costumerErpCode"
          ]
        },
        "HolooCustomerDto": {
          "type": "object",
          "properties": {
            "EconomicId": {
              "type": "string"
            },
            "IsPurchaser": {
              "type": "string"
            },
            "IsSeller": {
              "type": "string"
            },
            "IsBlackList": {
              "type": "string"
            },
            "IsVaseteh": {
              "type": "string"
            },
            "VasetehPorsant": {
              "type": "string"
            },
            "Mandeh": {
              "type": "string"
            },
            "Credit": {
              "type": "string"
            },
            "ErpCode": {
              "type": "string"
            },
            "type": {
              "type": "string"
            },
            "IsActive": {
              "type": "string"
            },
            "selectedPriceType": {
              "type": "string"
            },
            "isAmer": {
              "type": "string"
            },
            "Code": {
              "type": "string"
            },
            "Name": {
              "type": "string"
            },
            "BesSarfasl": {
              "type": "string"
            },
            "Mobile": {
              "type": "string"
            },
            "WebId": {
              "type": "string"
            }
          },
          "required": [
            "EconomicId",
            "IsPurchaser",
            "IsSeller",
            "IsBlackList",
            "IsVaseteh",
            "VasetehPorsant",
            "Mandeh",
            "Credit",
            "ErpCode",
            "type",
            "IsActive",
            "selectedPriceType",
            "isAmer"
          ]
        }
      }
    }
  },
  "customOptions": {
    "persistAuthorization": true
  }
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
