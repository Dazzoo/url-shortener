interface GeoResponse {
  country: string
  countryCode: string
  city: string
  region: string
}

export class GeoService {
  private static async fetchGeoData(ip: string): Promise<GeoResponse | null> {
    try {
      // Skip local IPs
      if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        console.log('Skipping local IP:', ip)
        return null
      }

      console.log('Fetching geo data for IP:', ip)
      const response = await fetch(`https://ipapi.co/${ip}/json/`)
      console.log('Geo API response status:', response.status)
      
      if (!response.ok) {
        console.error('Geo API error:', response.statusText)
        return null
      }
      
      const data = await response.json()
      console.log('Geo API response data:', data)
      
      if (!data.country_name) {
        console.error('No country data in response:', data)
        return null
      }

      return {
        country: data.country_name,
        countryCode: data.country_code,
        city: data.city,
        region: data.region
      }
    } catch (error) {
      console.error('Error fetching geo data:', error)
      return null
    }
  }

  static async getCountryFromIP(ip: string): Promise<string> {
    if (!ip) {
      console.log('No IP provided')
      return 'Unknown'
    }

    // Clean IP address
    const cleanIP = ip.trim()
    if (!cleanIP) {
      console.log('Empty IP after cleaning')
      return 'Unknown'
    }
    
    const geoData = await this.fetchGeoData(cleanIP)
    console.log('Geo data result:', geoData)
    return geoData?.country || 'Unknown'
  }
} 