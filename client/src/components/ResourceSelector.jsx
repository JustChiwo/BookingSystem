import { WaterDropIcon } from './Icons';

function ResourceSelector({ resources, value, loading, onChange }) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor="resource">
        <WaterDropIcon />
        Choose a bay
      </label>
      <select
        className="form-control"
        id="resource"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading || resources.length === 0}
      >
        {loading && <option value="">Loading bays...</option>}
        {!loading && resources.length === 0 && <option value="">No bays available</option>}
        {resources.map((resource) => (
          <option key={resource} value={resource}>
            {resource}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ResourceSelector;
