export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TableDefinition<Row, RequiredInsert extends keyof Row> = {
  Insert: Omit<Partial<Row>, RequiredInsert> & Pick<Row, RequiredInsert>;
  Relationships: [];
  Row: Row;
  Update: Partial<Row>;
};

type ProfileRow = {
  archived_at: string | null;
  avatar: string | null;
  created_at: string;
  first_name: string;
  id: string;
  language: string;
  last_name: string;
  subscription_plan: string;
  subscription_status: string;
  theme: string;
  timezone: string;
  updated_at: string;
};

type ChildRow = {
  archived_at: string | null;
  avatar: string | null;
  birth_date: string;
  birth_height: number | null;
  birth_place: string | null;
  birth_weight: number | null;
  blood_type: string | null;
  created_at: string;
  first_name: string;
  gender: string;
  id: string;
  is_default: boolean;
  last_name: string | null;
  notes: string | null;
  updated_at: string;
  user_id: string;
};

type UserSettingsRow = {
  ai_enabled: boolean;
  created_at: string;
  date_format: string;
  email_notifications: boolean;
  id: string;
  language: string;
  push_notifications: boolean;
  reminder_notifications: boolean;
  theme: string;
  time_format: string;
  timezone: string;
  updated_at: string;
  user_id: string;
};

type UserDeviceRow = {
  app_version: string | null;
  created_at: string;
  device_id: string;
  device_name: string | null;
  id: string;
  is_current: boolean;
  last_seen_at: string;
  operating_system: string | null;
  platform: string;
  push_token: string | null;
  updated_at: string;
  user_id: string;
};

type EventCategoryRow = {
  color: string;
  created_at: string;
  icon: string;
  id: string;
  is_active: boolean;
  name: string;
  sort_order: number;
};

type EventSubCategoryRow = {
  category_id: string;
  created_at: string;
  icon: string;
  id: string;
  name: string;
  sort_order: number;
};

type EventRow = {
  ai_enabled: boolean;
  archived_at: string | null;
  category_id: string;
  child_id: string;
  created_at: string;
  description: string | null;
  id: string;
  importance: string | null;
  is_favorite: boolean;
  location: string | null;
  metadata: Json;
  mood: string | null;
  occurred_at: string;
  sub_category_id: string | null;
  title: string;
  updated_at: string;
  source: string;
};

type EventTagRow = {
  created_at: string;
  event_id: string;
  id: string;
  tag: string;
};

type EventMediaRow = {
  archived_at: string | null;
  created_at: string;
  duration: number | null;
  event_id: string;
  file_name: string;
  file_size: number;
  height: number | null;
  id: string;
  media_type: string;
  mime_type: string;
  storage_path: string;
  thumbnail_path: string | null;
  width: number | null;
};

type ReminderRow = {
  child_id: string;
  created_at: string;
  description: string | null;
  event_id: string | null;
  id: string;
  reminder_at: string;
  repeat_type: string | null;
  status: string;
  title: string;
};

type AiConversationRow = {
  child_id: string;
  created_at: string;
  id: string;
  title: string;
  updated_at: string;
};

type AiMessageRow = {
  completion_tokens: number | null;
  content: string;
  conversation_id: string;
  created_at: string;
  id: string;
  model: string;
  prompt_tokens: number | null;
  role: string;
};

type AiAnalysisRow = {
  analysis: string;
  child_id: string;
  confidence_score: number | null;
  created_at: string;
  development_categories: string[];
  emotion: string | null;
  event_id: string;
  id: string;
  input_hash: string | null;
  keywords: string[];
  model: string;
  prompt_version: string;
  recommendations: string | null;
  short_title: string | null;
  summary: string;
  updated_at: string;
};

type AiArtifactRow = {
  child_id: string;
  content: Json;
  created_at: string;
  event_id: string | null;
  id: string;
  input_hash: string;
  kind: string;
  model: string;
  period_end: string | null;
  period_start: string | null;
  prompt_version: string;
  source_event_ids: string[];
  updated_at: string;
  user_id: string;
};

type AiEventEmbeddingRow = {
  child_id: string;
  content_hash: string;
  created_at: string;
  embedding: number[];
  event_id: string;
  id: string;
  model: string;
  updated_at: string;
  user_id: string;
};

type AiQueryEmbeddingRow = {
  child_id: string;
  created_at: string;
  embedding: number[];
  expires_at: string;
  id: string;
  model: string;
  query_hash: string;
  user_id: string;
};

type AiJobRow = {
  attempts: number;
  available_at: string;
  child_id: string;
  completed_at: string | null;
  created_at: string;
  error_code: string | null;
  event_id: string | null;
  id: string;
  input_hash: string;
  kind: string;
  locked_at: string | null;
  max_attempts: number;
  period_end: string | null;
  period_start: string | null;
  prompt_version: string;
  status: string;
  updated_at: string;
  user_id: string;
};

type AiUsageRow = {
  artifact_id: string | null;
  cache_hit: boolean;
  child_id: string | null;
  completion_tokens: number;
  conversation_id: string | null;
  created_at: string;
  duration_ms: number | null;
  error_code: string | null;
  estimated_cost: number;
  event_id: string | null;
  id: string;
  input_hash: string | null;
  model: string;
  operation: string;
  prompt_tokens: number;
  prompt_version: string | null;
  success: boolean;
  total_tokens: number;
  user_id: string;
};

type ReportRow = {
  archived_at: string | null;
  child_id: string;
  created_at: string;
  end_date: string;
  generated_by: string;
  id: string;
  report_type: string;
  start_date: string;
};

type NotificationRow = {
  body: string;
  child_id: string | null;
  created_at: string;
  id: string;
  is_read: boolean;
  reference_id: string | null;
  reference_type: string | null;
  title: string;
  type: string;
  user_id: string;
};

type SubscriptionRow = {
  billing_cycle: string;
  cancelled_at: string | null;
  created_at: string;
  current_period_end: string | null;
  current_period_start: string;
  id: string;
  last_payment_at: string | null;
  plan: string;
  premium_started_at: string | null;
  provider: string;
  provider_customer_id: string | null;
  provider_order_id: string | null;
  provider_subscription_id: string | null;
  product_id: string | null;
  renews_at: string | null;
  next_payment_at: string | null;
  status: string;
  user_id: string;
  variant_id: string | null;
};

type BillingWebhookEventRow = {
  claimed_at: string;
  created_at: string;
  event_key: string;
  event_name: string;
  payload_hash: string;
  processed_at: string | null;
  resource_id: string;
  resource_type: string;
  status: string;
};

type BillingCheckoutSessionRow = {
  checkout_url: string | null;
  created_at: string;
  expires_at: string;
  provider: string;
  provider_checkout_id: string | null;
  state: string;
  updated_at: string;
  user_id: string;
};

type AuditLogRow = {
  action: string;
  created_at: string;
  entity: string;
  entity_id: string | null;
  id: string;
  ip_address: string | null;
  metadata: Json | null;
  user_agent: string | null;
  user_id: string | null;
};

export type Database = {
  public: {
    CompositeTypes: Record<string, never>;
    Enums: Record<string, never>;
    Functions: {
      claim_ai_jobs: {
        Args: { batch_size?: number };
        Returns: AiJobRow[];
      };
      can_run_ai_job: {
        Args: {
          target_job_id?: string | null;
          target_kind: string;
          target_user_id: string;
        };
        Returns: boolean;
      };
      enqueue_ai_history: {
        Args: { target_child_id?: string | null };
        Returns: number;
      };
      enqueue_due_ai_stories: {
        Args: { reference_time?: string };
        Returns: number;
      };
      get_smart_dashboard_intelligence: {
        Args: { target_child_id: string };
        Returns: Json;
      };
      match_memory_embeddings: {
        Args: {
          excluded_event_id?: string | null;
          match_count?: number;
          query_embedding: number[];
          target_child_id: string;
        };
        Returns: { event_id: string; similarity: number }[];
      };
      save_memory_ai_insight: {
        Args: {
          target_child_id: string;
          target_content: Json;
          target_event_id: string;
          target_input_hash: string;
          target_model: string;
          target_prompt_version: string;
          target_user_id: string;
        };
        Returns: string;
      };
      user_has_ai_entitlement: {
        Args: { target_user_id: string };
        Returns: boolean;
      };
    };
    Tables: {
      ai_analysis: TableDefinition<
        AiAnalysisRow,
        "analysis" | "child_id" | "event_id" | "model" | "summary"
      >;
      ai_artifacts: TableDefinition<
        AiArtifactRow,
        | "child_id"
        | "content"
        | "input_hash"
        | "kind"
        | "model"
        | "prompt_version"
        | "user_id"
      >;
      ai_conversations: TableDefinition<
        AiConversationRow,
        "child_id" | "title"
      >;
      ai_messages: TableDefinition<
        AiMessageRow,
        "content" | "conversation_id" | "model" | "role"
      >;
      ai_event_embeddings: TableDefinition<
        AiEventEmbeddingRow,
        | "child_id"
        | "content_hash"
        | "embedding"
        | "event_id"
        | "model"
        | "user_id"
      >;
      ai_jobs: TableDefinition<
        AiJobRow,
        "child_id" | "input_hash" | "kind" | "prompt_version" | "user_id"
      >;
      ai_query_embeddings: TableDefinition<
        AiQueryEmbeddingRow,
        "child_id" | "embedding" | "model" | "query_hash" | "user_id"
      >;
      ai_usage: TableDefinition<AiUsageRow, "model" | "operation" | "user_id">;
      audit_logs: TableDefinition<AuditLogRow, "action" | "entity">;
      billing_checkout_sessions: TableDefinition<
        BillingCheckoutSessionRow,
        "expires_at" | "user_id"
      >;
      billing_webhook_events: TableDefinition<
        BillingWebhookEventRow,
        | "event_key"
        | "event_name"
        | "payload_hash"
        | "resource_id"
        | "resource_type"
      >;
      children: TableDefinition<
        ChildRow,
        "birth_date" | "first_name" | "gender" | "user_id"
      >;
      event_categories: TableDefinition<
        EventCategoryRow,
        "color" | "icon" | "name"
      >;
      event_media: TableDefinition<
        EventMediaRow,
        | "event_id"
        | "file_name"
        | "file_size"
        | "media_type"
        | "mime_type"
        | "storage_path"
      >;
      event_sub_categories: TableDefinition<
        EventSubCategoryRow,
        "category_id" | "icon" | "name"
      >;
      event_tags: TableDefinition<EventTagRow, "event_id" | "tag">;
      events: TableDefinition<
        EventRow,
        "category_id" | "child_id" | "occurred_at" | "title"
      >;
      notifications: TableDefinition<
        NotificationRow,
        "body" | "title" | "type" | "user_id"
      >;
      profiles: TableDefinition<ProfileRow, "first_name" | "id" | "last_name">;
      reminders: TableDefinition<
        ReminderRow,
        "child_id" | "reminder_at" | "status" | "title"
      >;
      reports: TableDefinition<
        ReportRow,
        "child_id" | "end_date" | "generated_by" | "report_type" | "start_date"
      >;
      subscriptions: TableDefinition<
        SubscriptionRow,
        "plan" | "provider" | "status" | "user_id"
      >;
      user_devices: TableDefinition<
        UserDeviceRow,
        "device_id" | "platform" | "user_id"
      >;
      user_settings: TableDefinition<UserSettingsRow, "user_id">;
    };
    Views: Record<string, never>;
  };
};

export type Tables<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Row"];

export type TablesInsert<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Insert"];

export type TablesUpdate<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Update"];
