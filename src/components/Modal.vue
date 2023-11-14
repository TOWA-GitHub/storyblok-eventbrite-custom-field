<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useFieldPlugin } from '@storyblok/field-plugin/vue3'
import axios from 'axios'

import type {
  Content,
  Event,
  EventbriteEventsResponse,
  EventbriteOrganizationsResponse,
  Organization,
} from '../types'
import EventComponent from './Event.vue'

defineEmits(['event-selected'])

const { data, actions } = useFieldPlugin()
const content = data.content as Content

const baseUrl = 'https://www.eventbriteapi.com/v3'
const apiToken =
  data.options.apiToken || import.meta.env.VITE_EVENTBRITE_API_TOKEN

const events = ref<Event[]>([])
const organizations = ref<Organization[]>([])
const selectedOrganization = ref<string>()

const isLoadingEvents = ref<boolean>(false)
const isLoadingOrgs = ref<boolean>(false)
const error = ref<string | null>(null)

const fetchEvents = () => {
  const organizationId = selectedOrganization.value

  if (!organizationId) {
    error.value = 'No organization selected'
    return
  }

  error.value = null
  isLoadingEvents.value = true

  axios({
    method: 'get',
    url: `${baseUrl}/organizations/${organizationId}/events/`,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  })
    .then((res: EventbriteEventsResponse) => {
      events.value = res.data.events.filter(
        (event) =>
          event.listed === true &&
          event.status !== 'completed' &&
          event.status !== 'canceled',
      )
      // Pagination: Eventbrite supports https://www.eventbrite.com/platform/api#/reference/event/list/list-events-by-organization
    })
    .catch((err) => {
      events.value = []
      error.value = err.response.data.error_description
    })
    .finally(() => {
      isLoadingEvents.value = false
    })
}

onMounted(() => {
  isLoadingOrgs.value = true
  error.value = null

  axios({
    method: 'get',
    url: `${baseUrl}/users/me/organizations/`,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  })
    .then((res: EventbriteOrganizationsResponse) => {
      organizations.value = res.data.organizations.map(
        ({ id, name, locale }) => ({
          id,
          name,
          locale,
        }),
      )
      // Preselect first organization
      selectedOrganization.value = res.data.organizations[0]?.id
    })
    .then(() => {
      // Fetch events for preselected organization
      fetchEvents()
    })
    .catch((err) => {
      organizations.value = []
      error.value = err.response.data.error_description
    })
    .finally(() => {
      isLoadingOrgs.value = false
    })
})
// Refetch events when organization changes
watch(selectedOrganization, fetchEvents)
</script>

<template>
  <div class="modal">
    <SbHeader
      title="Eventbrite"
      hasButton
      buttonIcon="x"
      buttonVariant="tertiary"
      buttonLabel="Close"
      :onButtonClick="() => actions.setModalOpen(false)"
    />

    <SbSelect
      id="organization-select"
      name="organizations"
      loadingLabel="Loading Organizations..."
      v-model="selectedOrganization"
      :isLoading="isLoadingOrgs"
      :disabled="isLoadingOrgs"
      :options="
        organizations.map((org) => ({ value: org.id, label: org.name }))
      "
    />

    <aside
      v-if="isLoadingEvents"
      class="loading"
    >
      <SbLoading />
    </aside>

    <ul v-else-if="events.length">
      <EventComponent
        v-for="event in events"
        :key="event.id"
        :event="event"
        :active="event.id === content.event?.id"
        selectable
        @click="$emit('event-selected', event)"
      />
    </ul>
  </div>
</template>

<style scoped>
.modal {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--gap, 1rem);
  border-radius: 0.5rem;
}

aside {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20rem;
}

ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap, 1rem);
  padding: 0;
  list-style: none;
}
</style>
