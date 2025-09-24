import { getBaseUrl } from "./http";
import { getAuthToken } from "./auth";

export async function uploadImage(input: { file: File }): Promise<string> {
  const MUTATION = `mutation uploadImage($input: uploadImageInput!) {
          uploadImage(input: $input) {
              image {
                url
              }
          }
      }
      `;

  const formData = new FormData();
  formData.append(
    "operations",
    JSON.stringify({
      query: MUTATION,
      variables: { input: { file: null } },
    })
  );

  formData.append("map", JSON.stringify({ "0": ["variables.input.file"] }));
  formData.append("0", input.file);

  const url = getBaseUrl() + "/api/graphql";
  const token = getAuthToken();

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    // DO NOT set 'Content-Type' header—browser will set it automatically.
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || data?.errors) {
    const message = data?.errors?.[0]?.message || "GraphQL file upload failed";
    throw new Error(message);
  }

  return getBaseUrl() + data.data.uploadImage.image.url;
}
