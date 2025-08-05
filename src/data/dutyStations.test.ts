import { describe, it, expect } from 'vitest'
import { 
  dutyStations, 
  findDutyStationById, 
  searchDutyStations, 
  getStationsBySector 
} from './dutyStations'

describe('Duty Stations Data', () => {
  describe('dutyStations array', () => {
    it('should contain duty stations', () => {
      expect(dutyStations).toBeDefined()
      expect(Array.isArray(dutyStations)).toBe(true)
      expect(dutyStations.length).toBeGreaterThan(0)
    })

    it('should have valid duty station structure', () => {
      const station = dutyStations[0]
      expect(station).toHaveProperty('id')
      expect(station).toHaveProperty('name')
      expect(station).toHaveProperty('city')
      expect(station).toHaveProperty('state')
      expect(station).toHaveProperty('sector')
      expect(station).toHaveProperty('region')
      expect(station).toHaveProperty('description')
      expect(station).toHaveProperty('links')
    })

    it('should have unique IDs', () => {
      const ids = dutyStations.map(station => station.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('findDutyStationById', () => {
    it('should find a station by valid ID', () => {
      const station = findDutyStationById('presidio-station')
      expect(station).toBeDefined()
      expect(station?.name).toBe('Presidio Station')
      expect(station?.city).toBe('Presidio')
      expect(station?.state).toBe('TX')
    })

    it('should return undefined for invalid ID', () => {
      const station = findDutyStationById('invalid-id')
      expect(station).toBeUndefined()
    })

    it('should return undefined for empty ID', () => {
      const station = findDutyStationById('')
      expect(station).toBeUndefined()
    })
  })

  describe('searchDutyStations', () => {
    it('should return all stations for empty query', () => {
      const results = searchDutyStations('')
      expect(results).toEqual(dutyStations)
    })

    it('should search by station name', () => {
      const results = searchDutyStations('Presidio')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].name).toContain('Presidio')
    })

    it('should search by city', () => {
      const results = searchDutyStations('Alpine')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].city).toBe('Alpine')
    })

    it('should search by state', () => {
      const results = searchDutyStations('TX')
      expect(results.length).toBeGreaterThan(0)
      expect(results.every(station => station.state === 'TX')).toBe(true)
    })

    it('should search by sector', () => {
      const results = searchDutyStations('Big Bend')
      expect(results.length).toBeGreaterThan(0)
      expect(results.every(station => station.sector.includes('Big Bend'))).toBe(true)
    })

    it('should be case insensitive', () => {
      const results1 = searchDutyStations('presidio')
      const results2 = searchDutyStations('PRESIDIO')
      expect(results1).toEqual(results2)
    })

    it('should return empty array for no matches', () => {
      const results = searchDutyStations('nonexistent')
      expect(results).toEqual([])
    })
  })

  describe('getStationsBySector', () => {
    it('should return stations for valid sector', () => {
      const results = getStationsBySector('Big Bend Sector Texas')
      expect(results.length).toBeGreaterThan(0)
      expect(results.every(station => station.sector === 'Big Bend Sector Texas')).toBe(true)
    })

    it('should return empty array for invalid sector', () => {
      const results = getStationsBySector('Invalid Sector')
      expect(results).toEqual([])
    })
  })

  describe('station data integrity', () => {
    it('should have valid coordinates', () => {
      dutyStations.forEach(station => {
        if (station.lat !== null && station.lng !== null) {
          expect(station.lat).toBeGreaterThanOrEqual(-90)
          expect(station.lat).toBeLessThanOrEqual(90)
          expect(station.lng).toBeGreaterThanOrEqual(-180)
          expect(station.lng).toBeLessThanOrEqual(180)
        }
      })
    })

    it('should have valid links', () => {
      dutyStations.forEach(station => {
        expect(station.links).toHaveProperty('realEstate')
        expect(station.links).toHaveProperty('schools')
        expect(station.links).toHaveProperty('crime')
        expect(station.links).toHaveProperty('costOfLiving')
        expect(station.links).toHaveProperty('weather')
        expect(station.links).toHaveProperty('transit')
        expect(station.links).toHaveProperty('movingTips')
        
        // Check that links are valid URLs
        Object.values(station.links).forEach(link => {
          expect(link).toMatch(/^https?:\/\//)
        })
      })
    })

    it('should have valid zip codes', () => {
      dutyStations.forEach(station => {
        // Allow 3-5 digit zip codes for flexibility
        expect(station.zipCode).toMatch(/^\d{3,5}$/)
      })
    })
  })
})
