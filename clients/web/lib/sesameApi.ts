/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** BotParams */
export interface BotParams {
  /** Conversation Id */
  conversation_id: string;
  /**
   * Actions
   * @default []
   */
  actions?: RTVIMessage[];
}

/** ConversationCreateModel */
export interface ConversationCreateModel {
  /**
   * Workspace Id
   * @format uuid
   */
  workspace_id: string;
  /** Title */
  title?: string | null;
  /**
   * Language Code
   * @default "english"
   */
  language_code?: string | null;
}

/** ConversationModel */
export interface ConversationModel {
  /**
   * Conversation Id
   * @format uuid
   */
  conversation_id: string;
  /**
   * Workspace Id
   * @format uuid
   */
  workspace_id: string;
  /** Title */
  title?: string | null;
  /**
   * Archived
   * @default false
   */
  archived?: boolean | null;
  /**
   * Language Code
   * @default "english"
   */
  language_code?: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** ConversationUpdateModel */
export interface ConversationUpdateModel {
  /** Title */
  title: string | null;
  /**
   * Language Code
   * @default "english"
   */
  language_code?: string | null;
}

/** CreateTokenRequest */
export interface CreateTokenRequest {
  /** Title */
  title?: string | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** MessageCreateModel */
export interface MessageCreateModel {
  /** Content */
  content: {
    role: "assistant" | "system" | "user";
    content: string;
  };
  /** Extra Metadata */
  extra_metadata?: Record<string, any> | null;
  [key: string]: any;
}

/** MessageModel */
export interface MessageModel {
  /**
   * Message Id
   * @format uuid
   */
  message_id: string;
  /**
   * Conversation Id
   * @format uuid
   */
  conversation_id: string;
  /** Message Number */
  message_number: number;
  /** Content */
  content: object;
  /**
   * Language Code
   * @default "english"
   */
  language_code?: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
  /** Extra Metadata */
  extra_metadata?: object | null;
}

/** MessageWithConversationModel */
export interface MessageWithConversationModel {
  message: MessageModel;
  conversation: ConversationModel;
}

/** RTVIMessage */
export interface RTVIMessage {
  /**
   * Label
   * @default "rtvi-ai"
   */
  label?: "rtvi-ai";
  /** Type */
  type: string;
  /** Id */
  id: string;
  /** Data */
  data?: object | null;
}

/** RTVIServiceConfig */
export interface RTVIServiceConfig {
  /** Service */
  service: string;
  /** Options */
  options: RTVIServiceOptionConfig[];
}

/** RTVIServiceOptionConfig */
export interface RTVIServiceOptionConfig {
  /** Name */
  name: string;
  /** Value */
  value: any;
}

/** RevokeTokenRequest */
export interface RevokeTokenRequest {
  /** Token */
  token?: string | null;
}

/** ServiceCreateModel */
export interface ServiceCreateModel {
  /** Title */
  title: string;
  /** Service Type */
  service_type: string;
  /** Service Provider */
  service_provider?: string | null;
  /** Api Key */
  api_key: string;
  /** Workspace Id */
  workspace_id?: string | null;
  /** Options */
  options?: object | null;
}

/** ServiceInfo */
export interface ServiceInfo {
  /** Service Name */
  service_name: string;
  /** Service Type */
  service_type: string;
  /** Requires Api Key */
  requires_api_key: boolean;
  /** Optional Params */
  optional_params: string[];
  /** Required Params */
  required_params: string[];
}

/** ServiceModel */
export interface ServiceModel {
  /**
   * Service Id
   * @format uuid
   */
  service_id: string;
  /** User Id */
  user_id: string;
  /** Workspace Id */
  workspace_id: string | null;
  /** Title */
  title: string;
  /** Service Type */
  service_type: string;
  /** Service Provider */
  service_provider: string | null;
  /** Api Key */
  api_key: string;
  /** Options */
  options: object | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** ServiceUpdateModel */
export interface ServiceUpdateModel {
  /** Title */
  title?: string | null;
  /** Api Key */
  api_key?: string | null;
  /** Options */
  options?: object | null;
}

/** UserLoginModel */
export interface UserLoginModel {
  /** Email */
  email: string;
  /** Password */
  password: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/** WorkspaceDefaultConfigModel */
export interface WorkspaceDefaultConfigModelInput {
  /** Config */
  config?: RTVIServiceConfig[] | null;
  /** Api Keys */
  api_keys?: object | null;
  /** Services */
  services?: object | null;
  /** Default Llm Context */
  default_llm_context?: MessageCreateModel[] | null;
  [key: string]: any;
}

export type BotProfile = "voice" | "vision";

/** WorkspaceDefaultConfigModel */
export interface WorkspaceDefaultConfigModelOutput {
  /** Config */
  config?: RTVIServiceConfig[] | null;
  /** Api Keys */
  api_keys?: Record<string, string> | null;
  /** Services */
  services?: Record<string, string> | null;
  /** Default Llm Context */
  default_llm_context?: MessageCreateModel[] | null;
  /** Bot Profile */
  bot_profile?: BotProfile;
  [key: string]: any;
}

/** WorkspaceModel */
export interface WorkspaceModel {
  /**
   * Workspace Id
   * @format uuid
   */
  workspace_id: string;
  /** Title */
  title: string;
  config: WorkspaceDefaultConfigModelOutput;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** WorkspaceUpdateModel */
export interface WorkspaceUpdateModel {
  /** Title */
  title?: string | null;
  config?: WorkspaceDefaultConfigModelInput | null;
}

/** WorkspaceWithConversations */
export interface WorkspaceWithConversations {
  /**
   * Workspace Id
   * @format uuid
   */
  workspace_id: string;
  /** Title */
  title: string;
  config: WorkspaceDefaultConfigModelOutput;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
  /** Conversations */
  conversations: ConversationModel[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Open Sesame
 * @version 0.1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name HomeGet
   * @summary Home
   * @request GET:/
   */
  homeGet = (params: RequestParams = {}) =>
    this.request<string, any>({
      path: `/`,
      method: "GET",
      ...params,
    });

  api = {
    /**
     * No description
     *
     * @tags Auth, Auth
     * @name LoginWithCredentialsApiAuthLoginPost
     * @summary Login With Credentials
     * @request POST:/api/auth/login
     */
    loginWithCredentialsApiAuthLoginPost: (
      data: UserLoginModel,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth, Auth
     * @name GetTokenApiAuthTokenGet
     * @summary Get Token
     * @request GET:/api/auth/token
     * @secure
     */
    getTokenApiAuthTokenGet: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/api/auth/token`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tokens
     * @name RetrieveUserTokensApiTokensGet
     * @summary Retrieve User Tokens
     * @request GET:/api/tokens
     * @secure
     */
    retrieveUserTokensApiTokensGet: (params: RequestParams = {}) =>
      this.request<Record<string, boolean | object[]>, any>({
        path: `/api/tokens`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tokens
     * @name CreateAUserTokenApiTokensTokenPost
     * @summary Create A User Token
     * @request POST:/api/tokens/token
     * @secure
     */
    createAUserTokenApiTokensTokenPost: (
      data: CreateTokenRequest,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/tokens/token`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tokens
     * @name RevokeAUserTokenApiTokensRevokePost
     * @summary Revoke A User Token
     * @request POST:/api/tokens/revoke
     * @secure
     */
    revokeAUserTokenApiTokensRevokePost: (
      data: RevokeTokenRequest,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/tokens/revoke`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Workspaces
     * @name GetWorkspacesApiWorkspacesGet
     * @summary Get Workspaces
     * @request GET:/api/workspaces
     * @secure
     */
    getWorkspacesApiWorkspacesGet: (params: RequestParams = {}) =>
      this.request<WorkspaceModel[], any>({
        path: `/api/workspaces`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Workspaces
     * @name CreateWorkspaceApiWorkspacesPost
     * @summary Create Workspace
     * @request POST:/api/workspaces
     * @secure
     */
    createWorkspaceApiWorkspacesPost: (
      data: WorkspaceUpdateModel,
      params: RequestParams = {},
    ) =>
      this.request<WorkspaceModel, HTTPValidationError>({
        path: `/api/workspaces`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Workspaces
     * @name GetWorkspaceApiWorkspacesWorkspaceIdGet
     * @summary Get Workspace
     * @request GET:/api/workspaces/{workspace_id}
     * @secure
     */
    getWorkspaceApiWorkspacesWorkspaceIdGet: (
      workspaceId: string,
      params: RequestParams = {},
    ) =>
      this.request<WorkspaceModel, HTTPValidationError>({
        path: `/api/workspaces/${workspaceId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Workspaces
     * @name UpdateWorkspaceApiWorkspacesWorkspaceIdPut
     * @summary Update Workspace
     * @request PUT:/api/workspaces/{workspace_id}
     * @secure
     */
    updateWorkspaceApiWorkspacesWorkspaceIdPut: (
      workspaceId: string,
      data: WorkspaceUpdateModel,
      params: RequestParams = {},
    ) =>
      this.request<WorkspaceModel, HTTPValidationError>({
        path: `/api/workspaces/${workspaceId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Workspaces
     * @name DeleteWorkspaceApiWorkspacesWorkspaceIdDelete
     * @summary Delete Workspace
     * @request DELETE:/api/workspaces/{workspace_id}
     * @secure
     */
    deleteWorkspaceApiWorkspacesWorkspaceIdDelete: (
      workspaceId: string,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/workspaces/${workspaceId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Conversations
     * @name GetConversationsByWorkspaceApiConversationsWorkspaceIdGet
     * @summary Get Conversations By Workspace
     * @request GET:/api/conversations/{workspace_id}
     * @secure
     */
    getConversationsByWorkspaceApiConversationsWorkspaceIdGet: (
      workspaceId: string,
      query?: {
        /**
         * Limit
         * @min 1
         * @default 20
         */
        limit?: number;
        /**
         * Offset
         * @min 0
         * @default 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ConversationModel[], HTTPValidationError>({
        path: `/api/conversations/${workspaceId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Conversations
     * @name GetRecentConversationsWithWorkspaceApiConversationsGet
     * @summary Get Recent Conversations (With Workspace)
     * @request GET:/api/conversations/
     * @secure
     */
    getRecentConversationsWithWorkspaceApiConversationsGet: (
      query?: {
        /**
         * Limit
         * @min 1
         * @default 50
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<WorkspaceWithConversations[], HTTPValidationError>({
        path: `/api/conversations/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Conversations
     * @name CreateConversationApiConversationsPost
     * @summary Create Conversation
     * @request POST:/api/conversations
     * @secure
     */
    createConversationApiConversationsPost: (
      data: ConversationCreateModel,
      params: RequestParams = {},
    ) =>
      this.request<ConversationModel, HTTPValidationError>({
        path: `/api/conversations`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Conversations
     * @name DeleteConversationApiConversationsConversationIdDelete
     * @summary Delete Conversation
     * @request DELETE:/api/conversations/{conversation_id}
     * @secure
     */
    deleteConversationApiConversationsConversationIdDelete: (
      conversationId: string,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/api/conversations/${conversationId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Conversations
     * @name UpdateConversationTitleApiConversationsConversationIdPut
     * @summary Update Conversation Title
     * @request PUT:/api/conversations/{conversation_id}
     * @secure
     */
    updateConversationTitleApiConversationsConversationIdPut: (
      conversationId: string,
      data: ConversationUpdateModel,
      params: RequestParams = {},
    ) =>
      this.request<ConversationModel, HTTPValidationError>({
        path: `/api/conversations/${conversationId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Conversations
     * @name GetConversationAndMessagesApiConversationsConversationIdMessagesGet
     * @summary Get Conversation And Messages
     * @request GET:/api/conversations/{conversation_id}/messages
     * @secure
     */
    getConversationAndMessagesApiConversationsConversationIdMessagesGet: (
      conversationId: string,
      params: RequestParams = {},
    ) =>
      this.request<object, HTTPValidationError>({
        path: `/api/conversations/${conversationId}/messages`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Conversations
     * @name CreateMessageApiConversationsConversationIdMessagesPost
     * @summary Create Message
     * @request POST:/api/conversations/{conversation_id}/messages
     * @secure
     */
    createMessageApiConversationsConversationIdMessagesPost: (
      conversationId: string,
      data: MessageCreateModel,
      params: RequestParams = {},
    ) =>
      this.request<MessageModel, HTTPValidationError>({
        path: `/api/conversations/${conversationId}/messages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Conversations
     * @name SearchMessagesApiConversationsWorkspaceIdSearchGet
     * @summary Search Messages
     * @request GET:/api/conversations/{workspace_id}/search
     * @secure
     */
    searchMessagesApiConversationsWorkspaceIdSearchGet: (
      workspaceId: string,
      query: {
        /**
         * Search Term
         * @minLength 1
         */
        search_term: string;
        /**
         * Limit
         * @min 1
         * @default 20
         */
        limit?: number;
        /**
         * Offset
         * @min 0
         * @default 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<MessageWithConversationModel[], HTTPValidationError>({
        path: `/api/conversations/${workspaceId}/search`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Services
     * @name GetSupportedServicesApiServicesSupportedGet
     * @summary Get Supported Services
     * @request GET:/api/services/supported
     */
    getSupportedServicesApiServicesSupportedGet: (
      query?: {
        /** Service Type */
        service_type?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServiceInfo[], HTTPValidationError>({
        path: `/api/services/supported`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Services
     * @name GetServicesApiServicesGet
     * @summary Get Services
     * @request GET:/api/services
     * @secure
     */
    getServicesApiServicesGet: (params: RequestParams = {}) =>
      this.request<ServiceModel[], any>({
        path: `/api/services`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Services
     * @name CreateServiceApiServicesPost
     * @summary Create Service
     * @request POST:/api/services
     * @secure
     */
    createServiceApiServicesPost: (
      data: ServiceCreateModel,
      params: RequestParams = {},
    ) =>
      this.request<ServiceModel, HTTPValidationError>({
        path: `/api/services`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Services
     * @name UpdateServiceApiServicesServiceIdPut
     * @summary Update Service
     * @request PUT:/api/services/{service_id}
     * @secure
     */
    updateServiceApiServicesServiceIdPut: (
      serviceId: string,
      data: ServiceUpdateModel,
      params: RequestParams = {},
    ) =>
      this.request<ServiceModel, HTTPValidationError>({
        path: `/api/services/${serviceId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Services
     * @name DeleteServiceApiServicesServiceIdDelete
     * @summary Delete Service
     * @request DELETE:/api/services/{service_id}
     * @secure
     */
    deleteServiceApiServicesServiceIdDelete: (
      serviceId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/api/services/${serviceId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags RTVI
     * @name StreamActionApiRtviActionPost
     * @summary Stream Action
     * @request POST:/api/rtvi/action
     * @secure
     */
    streamActionApiRtviActionPost: (
      data: BotParams,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/api/rtvi/action`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags RTVI
     * @name ConnectApiRtviConnectPost
     * @summary Connect
     * @request POST:/api/rtvi/connect
     * @secure
     */
    connectApiRtviConnectPost: (data: BotParams, params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/api/rtvi/connect`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
