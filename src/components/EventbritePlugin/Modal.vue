<template>
  <div class="modal-container">
    <div class="modal-header">
      <select
        name="organizations" 
        id="organization-select"
        @change="fetchEventsOfOrganization"
        :disabled="isLoading"
      >
        <option value="">Select an organization</option>
        <option 
          v-for="org in organizations"
          :key="org.id"
          :value="org.id"
        >
          {{ org.name }}
        </option>
      </select>
      <!-- Close Button -->
      <button
        type="button"
        class="btn btn-close"
        @click="() => plugin.actions.setModalOpen(false)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.75738 0.343176L0.343166 1.75739L4.58581 6.00003L0.343165 10.2427L1.75738 11.6569L6.00002 7.41424L10.2427 11.6569L11.6569 10.2427L7.41423 6.00003L11.6569 1.75739L10.2427 0.343176L6.00002 4.58582L1.75738 0.343176Z"
            fill="#1B243F"
          />
        </svg>
      </button>
    </div>

    <h3 v-if="isLoading">Loading...</h3>

    <!-- Event list -->
    <ul class="event-list" v-if="!isLoading">
      <li
        :class="{
          'item-card__selected': selectedEvent && selectedEvent.id === event.id
        }"
        v-for="event in events"
        :key="event.id"
        @click="$emit('select-event', event)"
      >
        <Event :event="event" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import './styles.css'
import { useFieldPlugin } from '@storyblok/field-plugin/vue3';
import axios from "axios";
import Event from './Event.vue';

defineProps({
  selectedEvent: {
    type: Object,
    default: null,
  },
});

defineEmits(['select-event']);

const plugin = useFieldPlugin();

const baseUrl = "https://www.eventbriteapi.com/v3";

// TODO: should API Token be saved in plugin config or frontend?
const apiToken = plugin.data.options.apiToken;

const isLoading = ref(false);

// TODO: add types
const events = ref<any[]>([]);
const organizations = ref<any[]>([]);

const fetchEventsOfOrganization = (event: Event) => {
  const organizationId = (event.target as HTMLSelectElement)?.value;

  if (!organizationId) return;

  isLoading.value = true;

  axios({
    method: 'get',
    url: `${baseUrl}/organizations/${organizationId}/events/`,
    headers: { 
      'Authorization': `Bearer ${apiToken}`,  
    }
  })
    .then(res => {
      events.value = res.data.events;
      isLoading.value = false;

      // pagination can be found in res.data
      // Eventbrite supports https://www.eventbrite.com/platform/api#/reference/event/list/list-events-by-organization
    });
};

onMounted(() => {
  isLoading.value = true;

  axios({
    method: 'get',
    url: `${baseUrl}/users/me/organizations/`,
    headers: { 
      'Authorization': `Bearer ${apiToken}`, 
    }
  })
    .then(res => {
      organizations.value = res.data.organizations;
      isLoading.value = false;
    });
})
</script>