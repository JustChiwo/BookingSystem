import { CalendarIcon } from './Icons';
import { getLocalDateString } from '../utils/date';

function DatePicker({ value, onChange }) {
  const today = getLocalDateString();

  return (
    <div className="field-group">
      <label className="field-label" htmlFor="booking-date">
        <CalendarIcon />
        Choose a date
      </label>
      <input
        className="form-control"
        id="booking-date"
        type="date"
        value={value}
        min={today}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export default DatePicker;
