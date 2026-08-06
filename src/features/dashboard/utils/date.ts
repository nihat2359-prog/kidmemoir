const DAY_IN_MILLISECONDS = 86_400_000;

export function getGreetingPeriod(
  date = new Date(),
): "afternoon" | "evening" | "morning" | "night" {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Europe/Istanbul",
    }).format(date),
  );

  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 23) return "evening";
  return "night";
}

export function getAgeParts(birthDate: string, now = new Date()) {
  const [year = 1970, month = 1, day = 1] = birthDate.split("-").map(Number);
  let years = now.getUTCFullYear() - year;
  let months = now.getUTCMonth() + 1 - month;
  let days = now.getUTCDate() - day;

  if (days < 0) {
    months -= 1;
    days += new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0),
    ).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    days: Math.max(days, 0),
    months: Math.max(months, 0),
    years: Math.max(years, 0),
  };
}

export function getNextBirthday(birthDate: string, now = new Date()) {
  const [, month = 1, day = 1] = birthDate.split("-").map(Number);
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  let birthday = Date.UTC(now.getUTCFullYear(), month - 1, day);

  if (birthday < today)
    birthday = Date.UTC(now.getUTCFullYear() + 1, month - 1, day);

  return {
    date: new Date(birthday),
    days: Math.ceil((birthday - today) / DAY_IN_MILLISECONDS),
  };
}

export function getMonthBounds(now = new Date()) {
  return {
    end: new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    ).toISOString(),
    start: new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    ).toISOString(),
  };
}
