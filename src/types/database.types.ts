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
  memory_quote: string | null;
  importance_score: number | null;
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

type SeoClusterRow = {
  category: string;
  created_at: string;
  description: string;
  domain_id: string;
  id: string;
  locale: string;
  slug: string;
  status: string;
  title: string;
  updated_at: string;
};

type SeoTopicRow = {
  cluster_id: string;
  created_at: string;
  depth: number;
  description: string;
  id: string;
  locale: string;
  parent_id: string | null;
  semantic_terms: string[];
  slug: string;
  status: string;
  title: string;
  updated_at: string;
};

type SeoPageRow = {
  category: string;
  child_age_max: number | null;
  child_age_min: number | null;
  cluster_id: string;
  content: Json;
  content_hash: string | null;
  content_source: string;
  content_word_count: number;
  created_at: string;
  cta: Json;
  difficulty: string | null;
  excerpt: string;
  faq: Json;
  generation_metadata: Json;
  hero: Json;
  howto: Json | null;
  id: string;
  locale: string;
  parent_page_id: string | null;
  parent_stage: string | null;
  path_key: string;
  published_at: string | null;
  quality_score: number;
  reading_time: number;
  reviewed_at: string | null;
  schema_type: string;
  search_intent: string;
  search_volume: number | null;
  semantic_terms: string[];
  seo_description: string;
  seo_title: string;
  slug: string;
  slug_path: string[];
  status: string;
  title: string;
  topic_id: string;
  translation_key: string;
  updated_at: string;
};

type SeoPageRelationRow = {
  created_at: string;
  relation_type: string;
  source_page_id: string;
  target_page_id: string;
  weight: number;
};

type SeoTopicRelationRow = {
  created_at: string;
  relation_type: string;
  semantic_score: number;
  source_topic_id: string;
  target_topic_id: string;
  weight: number;
};

type SeoDomainRow = {
  authority_score: number;
  created_at: string;
  id: string;
  is_primary_authority: boolean;
  slug: string;
  status: string;
  updated_at: string;
};

type SeoDomainLocalizationRow = {
  created_at: string;
  description: string;
  domain_id: string;
  locale: string;
  name: string;
  updated_at: string;
};

type SeoTemplateRow = {
  created_at: string;
  id: string;
  required_blocks: string[];
  schema_type: string;
  slug: string;
  status: string;
  updated_at: string;
};

type SeoCtaTargetRow = {
  created_at: string;
  destination_path: string;
  id: string;
  slug: string;
  status: string;
  updated_at: string;
};

type SeoAuthorityTopicRow = {
  authority_tier: number;
  authority_weight: number;
  created_at: string;
  id: string;
  slug: string;
  updated_at: string;
};

type SeoTopicIntelligenceRow = {
  ai_prompt_id: string | null;
  authority_contribution_score: number;
  content_status: string;
  content_tier: number;
  competition_score: number;
  conversion_quality_score: number;
  created_at: string;
  domain_id: string;
  evergreen_score: number;
  freshness_score: number;
  human_reviewed: boolean;
  information_value_score: number;
  intent_quality_score: number;
  internal_link_quality_score: number;
  internal_link_score: number;
  parent_value_score: number;
  premium_conversion_score: number;
  priority_score: number;
  prompt_version: string | null;
  quality_score: number;
  reviewed_at: string | null;
  search_intent: string;
  seo_value: number;
  template_id: string;
  topic_id: string;
  uniqueness_score: number;
  updated_at: string;
};

type SeoTopicAuthorityMapRow = {
  authority_topic_id: string;
  relevance_score: number;
  topic_id: string;
};

type SeoTopicConversionMapRow = {
  cta_target_id: string;
  priority: number;
  topic_id: string;
};

type SeoKeywordTargetRow = {
  created_at: string;
  id: string;
  keyword: string;
  locale: string;
  normalized_keyword: string;
  search_intent: string;
};

type SeoTopicKeywordRow = {
  created_at: string;
  keyword_id: string;
  role: string;
  topic_id: string;
};

type SeoTopicMetricDailyRow = {
  average_position: number | null;
  clicks: number;
  conversions: number;
  created_at: string;
  ctr: number;
  currency: string;
  impressions: number;
  metric_date: string;
  organic_visits: number;
  premium_conversions: number;
  revenue_attribution: number;
  topic_id: string;
  updated_at: string;
};

type SeoSectionDefinitionRow = {
  created_at: string;
  id: string;
  slug: string;
  status: string;
  supports_media: string[];
  updated_at: string;
};

type SeoTemplateRuleRow = {
  created_at: string;
  maximum_faq_items: number;
  maximum_internal_links: number;
  maximum_words: number;
  minimum_faq_items: number;
  minimum_internal_links: number;
  minimum_words: number;
  recommended_words: number;
  template_id: string;
  updated_at: string;
};

type SeoTemplateSectionRow = {
  is_required: boolean;
  position: number;
  section_definition_id: string;
  template_id: string;
};

type SeoContentDraftRow = {
  approved_at: string | null;
  content_hash: string | null;
  created_at: string;
  freshness_score: number;
  generated_at: string | null;
  id: string;
  locale: string;
  model: string | null;
  outline: Json;
  primary_keyword: string | null;
  prompt_version: string | null;
  published_page_id: string | null;
  quality_score: number;
  reviewed_at: string | null;
  reviewed_by: string | null;
  reviewer_notes: string | null;
  secondary_keywords: string[];
  seo_description: string | null;
  seo_title: string | null;
  status: string;
  template_id: string;
  title: string | null;
  topic_id: string;
  updated_at: string;
  version: number;
  word_count: number;
};

type SeoDraftSectionRow = {
  body: Json;
  created_at: string;
  draft_id: string;
  heading: string | null;
  id: string;
  position: number;
  section_definition_id: string;
  updated_at: string;
  word_count: number;
};

type SeoFactReferenceRow = {
  claim_key: string;
  created_at: string;
  draft_section_id: string;
  id: string;
  published_at: string | null;
  publisher: string | null;
  reference_status: string;
  source_title: string | null;
  source_url: string | null;
  updated_at: string;
  verified_at: string | null;
  verified_by: string | null;
};

type SeoMediaRecommendationRow = {
  alt_text_guidance: string | null;
  brief: string;
  created_at: string;
  draft_section_id: string;
  id: string;
  media_type: string;
  position: number;
  status: string;
  updated_at: string;
};

type SeoDraftFaqItemRow = {
  answer: string;
  created_at: string;
  draft_id: string;
  id: string;
  position: number;
  question: string;
  updated_at: string;
};

type SeoDraftRelatedTopicRow = {
  content_type: string;
  draft_id: string;
  position: number;
  semantic_score: number;
  target_topic_id: string;
};

type SeoDraftCtaRow = {
  cta_target_id: string;
  draft_id: string;
  position: string;
  priority: number;
};

type SeoQualityRuleRow = {
  created_at: string;
  id: string;
  is_required: boolean;
  slug: string;
  status: string;
  updated_at: string;
  weight: number;
};

type SeoQualityAssessmentRow = {
  created_at: string;
  draft_content_hash: string;
  draft_id: string;
  evaluated_at: string;
  id: string;
  passed: boolean;
  score: number;
};

type SeoQualityResultRow = {
  assessment_id: string;
  findings: Json;
  passed: boolean;
  rule_id: string;
  score: number;
};

type SeoDraftWorkflowEventRow = {
  actor_id: string | null;
  created_at: string;
  draft_id: string;
  from_status: string | null;
  id: string;
  notes: string | null;
  to_status: string;
};

type SeoContentMetricDailyRow = {
  average_position: number | null;
  clicks: number;
  conversions: number;
  created_at: string;
  ctr: number;
  currency: string;
  draft_id: string;
  impressions: number;
  metric_date: string;
  premium_conversions: number;
  revenue: number;
  updated_at: string;
};

export type Database = {
  public: {
    CompositeTypes: Record<string, never>;
    Enums: Record<string, never>;
    Functions: {
      finalize_seo_quality_assessment: {
        Args: { target_assessment_id: string };
        Returns: number;
      };
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
      get_memory_of_the_day: {
        Args: { target_child_id: string; target_date?: string };
        Returns: Json | null;
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
      request_ai_story: {
        Args: {
          reference_time?: string;
          target_child_id: string;
          target_kind: string;
        };
        Returns: Json;
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
      seo_clusters: TableDefinition<
        SeoClusterRow,
        "category" | "description" | "domain_id" | "locale" | "slug" | "title"
      >;
      seo_domains: TableDefinition<SeoDomainRow, "slug">;
      seo_domain_localizations: TableDefinition<
        SeoDomainLocalizationRow,
        "description" | "domain_id" | "locale" | "name"
      >;
      seo_templates: TableDefinition<
        SeoTemplateRow,
        "required_blocks" | "schema_type" | "slug"
      >;
      seo_cta_targets: TableDefinition<
        SeoCtaTargetRow,
        "destination_path" | "slug"
      >;
      seo_authority_topics: TableDefinition<
        SeoAuthorityTopicRow,
        "authority_tier" | "authority_weight" | "slug"
      >;
      seo_page_relations: TableDefinition<
        SeoPageRelationRow,
        "relation_type" | "source_page_id" | "target_page_id"
      >;
      seo_pages: TableDefinition<
        SeoPageRow,
        | "category"
        | "cluster_id"
        | "cta"
        | "excerpt"
        | "hero"
        | "locale"
        | "reading_time"
        | "schema_type"
        | "search_intent"
        | "seo_description"
        | "seo_title"
        | "slug"
        | "slug_path"
        | "title"
        | "topic_id"
      >;
      seo_topic_relations: TableDefinition<
        SeoTopicRelationRow,
        "source_topic_id" | "target_topic_id"
      >;
      seo_topic_intelligence: TableDefinition<
        SeoTopicIntelligenceRow,
        | "authority_contribution_score"
        | "competition_score"
        | "domain_id"
        | "evergreen_score"
        | "internal_link_score"
        | "parent_value_score"
        | "premium_conversion_score"
        | "search_intent"
        | "seo_value"
        | "template_id"
        | "topic_id"
      >;
      seo_topic_authority_map: TableDefinition<
        SeoTopicAuthorityMapRow,
        "authority_topic_id" | "relevance_score" | "topic_id"
      >;
      seo_topic_conversion_map: TableDefinition<
        SeoTopicConversionMapRow,
        "cta_target_id" | "topic_id"
      >;
      seo_keyword_targets: TableDefinition<
        SeoKeywordTargetRow,
        "keyword" | "locale" | "normalized_keyword" | "search_intent"
      >;
      seo_topic_keywords: TableDefinition<
        SeoTopicKeywordRow,
        "keyword_id" | "role" | "topic_id"
      >;
      seo_topic_metrics_daily: TableDefinition<
        SeoTopicMetricDailyRow,
        "metric_date" | "topic_id"
      >;
      seo_section_definitions: TableDefinition<SeoSectionDefinitionRow, "slug">;
      seo_template_rules: TableDefinition<
        SeoTemplateRuleRow,
        "maximum_words" | "minimum_words" | "recommended_words" | "template_id"
      >;
      seo_template_sections: TableDefinition<
        SeoTemplateSectionRow,
        "position" | "section_definition_id" | "template_id"
      >;
      seo_content_drafts: TableDefinition<
        SeoContentDraftRow,
        "locale" | "template_id" | "topic_id"
      >;
      seo_draft_sections: TableDefinition<
        SeoDraftSectionRow,
        "draft_id" | "position" | "section_definition_id"
      >;
      seo_fact_references: TableDefinition<
        SeoFactReferenceRow,
        "claim_key" | "draft_section_id"
      >;
      seo_media_recommendations: TableDefinition<
        SeoMediaRecommendationRow,
        "brief" | "draft_section_id" | "media_type"
      >;
      seo_draft_faq_items: TableDefinition<
        SeoDraftFaqItemRow,
        "answer" | "draft_id" | "position" | "question"
      >;
      seo_draft_related_topics: TableDefinition<
        SeoDraftRelatedTopicRow,
        | "content_type"
        | "draft_id"
        | "position"
        | "semantic_score"
        | "target_topic_id"
      >;
      seo_draft_ctas: TableDefinition<
        SeoDraftCtaRow,
        "cta_target_id" | "draft_id" | "position"
      >;
      seo_quality_rules: TableDefinition<SeoQualityRuleRow, "slug" | "weight">;
      seo_quality_assessments: TableDefinition<
        SeoQualityAssessmentRow,
        "draft_content_hash" | "draft_id"
      >;
      seo_quality_results: TableDefinition<
        SeoQualityResultRow,
        "assessment_id" | "passed" | "rule_id" | "score"
      >;
      seo_draft_workflow_events: TableDefinition<
        SeoDraftWorkflowEventRow,
        "draft_id" | "to_status"
      >;
      seo_content_metrics_daily: TableDefinition<
        SeoContentMetricDailyRow,
        "draft_id" | "metric_date"
      >;
      seo_topics: TableDefinition<
        SeoTopicRow,
        "cluster_id" | "description" | "locale" | "slug" | "title"
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
