import { buildResultList } from '@coveo/headless';
import { searchEngine } from './searchEngine';

const fieldsToInclude = [
  'lci_page_title',
  'lci_category',
  'lci_news_events_categories',
  'lci_delivery_mode',
  'lci_diplomas',
  'lci_diplomas_acronym',
  'lci_duration',
  'lci_duration_in_hours',
  'lci_duration_in_months',
  'lci_end_time',
  'lci_event_url',
  'lci_hero_image',
  'lci_image',
  'lci_location',
  'lci_program_description',
  'lci_program_starts',
  'lci_publish_date',
  'lci_schedule',
  'lci_semester',
  'lci_start_time',
  'lci_status',
  'lci_teaching_language',
  'lci_teaching_language_sentence',
  'lci_time',
  'lci_title',
  'lci_theme_color',
  'lci_primary_label',
];

export const resultList = () => buildResultList(searchEngine, {
  options: {
    fieldsToInclude,
  },
});
