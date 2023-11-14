<script setup lang="ts">
import { computed } from 'vue'
import type { Event } from '../types'

const { event, active, selectable } = defineProps<{
  event: Event
  active?: boolean
  selectable?: boolean
}>()

const dateFormat = new Intl.DateTimeFormat('de-AT', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZone: event.start.timezone,
})

const formattedStartDate = computed(() =>
  dateFormat.format(new Date(event.start.local)),
)

const formattedEndDate = computed(() =>
  dateFormat.format(new Date(event.end.local)),
)
</script>

<template>
  <li :class="[{ active }, { selectable }]">
    <img
      :src="event.logo.url"
      :alt="`${event.name.text} ${event.id}`"
    />
    <article>
      <header>
        <h2 class="text-title">
          {{ event.name.text }}
        </h2>
        <span class="text-caption">{{ event.status }}</span>
      </header>
      <aside
        v-if="formattedStartDate || formattedEndDate"
        class="text-subtitle"
      >
        <span v-if="formattedStartDate">{{ formattedStartDate }}</span>
        <span v-if="formattedEndDate">&mdash;</span>
        <span v-if="formattedEndDate">{{ formattedEndDate }}</span>
      </aside>
      <div
        v-if="selectable"
        class="text-body"
      >
        <p>
          {{ event.description.text }}
        </p>
      </div>
      <footer>
        <a
          class="text-link"
          :href="event.url"
          target="_blank"
          @click.stop
        >
          See on Eventbrite
        </a>
      </footer>
    </article>
  </li>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  border: 1px solid var(--light);
  border-radius: 0.5rem;
  overflow: hidden;
  color: var(--sb_dark_blue);
  max-width: 90rem;
  background-color: var(--white);

  transition: all var(--transition-base);
}

li.selectable:hover {
  color: var(--sb_dark_blue);
  background-color: var(--light_50);
  border-color: var(--sb_green);
  cursor: pointer;
}
li.selectable.active {
  background-color: var(--sb_dark_blue);
  color: var(--white);
}

img {
  aspect-ratio: 16/8;
  object-fit: cover;
  background-color: var(--light);
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: var(--image-size);
}

article {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 70ch;
  gap: var(--gap);
  padding: 2rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

aside {
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--gap);
}

div {
  margin-top: 1rem;
}

footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--gap);
}
</style>
