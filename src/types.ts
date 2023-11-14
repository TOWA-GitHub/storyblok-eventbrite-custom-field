type Position = {
  x: number
  y: number
}

type CropMask = {
  top_left: Position
  width: number
  height: number
}

type Image = {
  url: string
  width: number
  height: number
}

type Logo = {
  id: string
  crop_mask: CropMask
  original: Image
  url: string
  aspect_ratio: string
  edge_color: string
  edge_color_set: boolean
}

type TextHtmlPair = {
  text: string
  html: string
}

type DateTime = {
  timezone: string
  local: string
  utc: string
}

export type Event = {
  name: TextHtmlPair
  description: TextHtmlPair
  url: string
  start: DateTime
  end: DateTime
  organization_id: string
  created: string
  changed: string
  published: string
  capacity: number
  capacity_is_custom: boolean
  status: 'completed' | 'draft' | 'live' | 'started' | 'canceled' | 'ended'
  currency: string
  listed: boolean
  shareable: boolean
  invite_only: boolean
  online_event: boolean
  show_remaining: boolean
  tx_time_limit: number
  hide_start_date: boolean
  hide_end_date: boolean
  locale: string
  is_locked: boolean
  privacy_setting: string
  is_series: boolean
  is_series_parent: boolean
  inventory_type: string
  is_reserved_seating: boolean
  show_pick_a_seat: boolean
  show_seatmap_thumbnail: boolean
  show_colors_in_seatmap_thumbnail: boolean
  source: string
  is_free: boolean
  version: null
  summary: string
  facebook_event_id: null
  logo_id: string
  organizer_id: string
  venue_id: null
  category_id: string
  subcategory_id: string
  format_id: string
  id: string
  resource_uri: string
  is_externally_ticketed: boolean
  logo: Logo
}

export type Content = {
  event: Event
  buttonLabel: string
}

export interface FieldPluginResponse {
  content: Content
  isModalOpen: boolean
  options: Record<string, unknown>
}

export type Organization = {
  id: string
  name: string
  locale: string
}

interface EventbriteResponse<T> {
  data: T
}

export interface EventbriteEventsResponse
  extends EventbriteResponse<{ events: Event[] }> {}

export interface EventbriteOrganizationsResponse
  extends EventbriteResponse<{ organizations: Organization[] }> {}
