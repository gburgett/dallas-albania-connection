
export default async function handler(event, context): Promise<string> {
  // your server-side functionality
  console.log('e', event);
  console.log('ctx', context);

  return null;
}