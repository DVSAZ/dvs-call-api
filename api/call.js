let latestCall = null;
let lastUpdated = null;

const SECRET_TOKEN = process.env.SECRET_TOKEN;

export default async function handler(req, res) {
  const token = req.query.token || req.headers.authorization;
  if (token !== SECRET_TOKEN) {
    return res.status(403).json({ error: "Unauthorized" });
  }
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

if (req.method === "OPTIONS") {
  return res.status(200).end(); // Handle preflight
}

  if (req.method === "POST") {
    const {
      caller_name,
      caller_phone,
      call_date,
      call_time,
      first_time_caller,
      lead_source,
      last_call_date,
      last_call_time
    } = req.body;

    latestCall = {
      caller_name,
      caller_phone,
      call_date,
      call_time,
      first_time_caller,
      lead_source,
      last_call_date,
      last_call_time
    };
    lastUpdated = Date.now();
    return res.status(200).json({ message: "Call stored." });
  }

  if (req.method === "GET") {
    if (!latestCall || (Date.now() - lastUpdated > 86400000)) {
      latestCall = null;
      return res.status(404).json({ error: "No recent call data." });
    }
    return res.status(200).json(latestCall);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
