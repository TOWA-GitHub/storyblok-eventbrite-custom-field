<script setup lang="ts">
import { useFieldPlugin } from '@storyblok/field-plugin/vue3'

import Modal from './components/Modal.vue'
import type { Event, Content } from './types'
import EventItem from './components/Event.vue'
import { onMounted, ref, watch } from 'vue'

const { data, actions } = useFieldPlugin()
const token = data.options.apiToken || import.meta.env.VITE_EVENTBRITE_API_TOKEN
const content = data.content as Content

const selectedEvent = ref<Event>()
const buttonLabel = ref<string>('')

const updateEvent = (): void => {
  actions.setContent({ ...content, event: selectedEvent.value })
  actions.setModalOpen(false)
}

const updateLabel = (): void => {
  actions.setContent({ ...content, buttonLabel: buttonLabel.value })
}

watch(selectedEvent, updateEvent)
watch(buttonLabel, updateLabel)

onMounted(() => {
  selectedEvent.value = content?.event
  buttonLabel.value = content?.buttonLabel ?? ''
})
</script>

<template>
  <template v-if="!token">
    <span class="text-danger">
      Please provide an Eventbrite API Token in the field options.
    </span>
  </template>
  <template v-else>
    <Modal
      v-if="data.isModalOpen"
      @event-selected="(event) => (selectedEvent = event)"
    />
    <main v-else>
      <header>
        <SbButton
          size="small"
          is-full-width
          :variant="selectedEvent ? 'tertiary' : 'primary'"
          @click="() => actions.setModalOpen(true)"
        >
          <template v-if="!selectedEvent">Select Event</template>
          <template v-else> Change Event </template>
        </SbButton>
        <SbButton
          v-if="selectedEvent"
          icon="trash"
          iconSize="large"
          variant="danger"
          has-icon-only
          @click="() => (selectedEvent = undefined)"
        />
      </header>
      <section>
        <EventItem
          v-if="selectedEvent"
          :event="selectedEvent"
        />
      </section>
      <footer>
        <SbTextField
          v-model.lazy="buttonLabel"
          placeholder="Jetzt Tickets sichern!"
          class="text-body"
        />
      </footer>
    </main>
  </template>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}

header {
  display: flex;
  gap: var(--gap);
  justify-content: space-between;
}

section {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
