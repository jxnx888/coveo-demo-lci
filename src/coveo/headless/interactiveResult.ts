import {
  buildInteractiveResult,
  InteractiveResult,
  Result,
} from '@coveo/headless';
import { searchEngine } from './searchEngine';

/* Click event track for Coveo module training */
export const interactiveResult = (result: Result): InteractiveResult => buildInteractiveResult(searchEngine, {
  options: {
    result,
  },
});
