import { writeSearchDocuments } from './index-ai-search'

if (import.meta.url === `file://${process.argv[1]}`) {
  const count = writeSearchDocuments()
  console.log(`Prepared ${count} documents. Upload/index through Cloudflare AI Search REST or dashboard.`)
}
