const EVENT_PROP_PREFIX = "on";

export const isEventProp = (key) => key.startsWith(EVENT_PROP_PREFIX);

export const getEventPropKey = (key) =>
  key.slice(EVENT_PROP_PREFIX.length).toLowerCase();
