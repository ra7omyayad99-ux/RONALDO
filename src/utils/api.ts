export function getBackendUrl(): string {
  if (typeof window === "undefined") return "";
  
  // 1. Check if user configured a custom URL via query parameter or settings
  let url = localStorage.getItem("game_backend_url") || "";
  url = url.trim();
  if (url) {
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }
    return url;
  }

  // 2. Default fallback logic:
  // If the host is not Cloud Run (.run.app) or localhost, we default to our live Cloud Run production server to make it work seamlessly on Vercel.
  const hostname = window.location.hostname;
  const isCloudRunOrLocal = hostname.includes(".run.app") || hostname.includes("localhost") || hostname.includes("127.0.0.1") || hostname.includes("0.0.0.0");
  
  if (!isCloudRunOrLocal) {
    return "https://ais-pre-tfllub5lr4mtn6rnuubzdk-333735345914.europe-west3.run.app";
  }

  return "";
}

export function setBackendUrl(url: string) {
  if (typeof window === "undefined") return;
  let cleaned = url.trim();
  if (cleaned.endsWith("/")) {
    cleaned = cleaned.slice(0, -1);
  }
  if (cleaned) {
    localStorage.setItem("game_backend_url", cleaned);
  } else {
    localStorage.removeItem("game_backend_url");
  }
}

// Interceptor helper to auto-detect and capture "backend" query parameter from the URL
export function initializeUrlBackend() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const backendParam = params.get("backend");
    if (backendParam) {
      setBackendUrl(backendParam);
      console.log("Automatically set cloud backend URL from param:", backendParam);
    }
  } catch (err) {
    console.error("Failed to parse URL for backend param:", err);
  }
}
