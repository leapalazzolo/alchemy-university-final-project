import { METADATA_API, CONVERTER_API } from "./config";
export async function getEvents(owner, name) {
  const response = await fetch(METADATA_API, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let events = await response.json();
  if (owner) events = events.filter((e) => e.owner === owner);
  if (name) events = events.filter((e) => e.name.includes(name));
  return events;
}

export function saveEvent(
  id,
  name,
  description,
  image,
  price,
  timestamp,
  location,
  owner,
  tags
) {
  const response = fetch(METADATA_API, {
    method: "POST",
    body: JSON.stringify({
      id,
      name,
      description,
      image,
      price,
      timestamp,
      location,
      owner,
      tags,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}
export async function ethToUsd() {
  const response = await fetch(CONVERTER_API, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export function getBadge(timestamp) {
  const today = new Date();
  const eventDay = new Date(timestamp);
  return eventDay.toDateString() === today.toDateString()
    ? "Today"
    : eventDay.getFullYear() === today.getFullYear() &&
      eventDay.getMonth() === today.getMonth()
    ? "This month"
    : "Soon";
}

export function formatTags(tags) {
  return tags.join(" \u2022 ");
}
