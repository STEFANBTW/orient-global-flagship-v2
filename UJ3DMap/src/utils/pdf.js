import { jsPDF } from 'jspdf'

/**
 * Generates and downloads a PDF of a calculated route, including metadata and turn-by-turn directions.
 * Works completely offline.
 * 
 * @param {string} startName - Name of starting location
 * @param {string} endName - Name of destination
 * @param {string} mode - Travel mode (Walk, Bike, Drive)
 * @param {Object} route - Calculated route object (coordinates, distance, steps)
 */
export function generateRoutePdf(startName, endName, mode, route) {
  const doc = new jsPDF()
  
  // Set Colors & Fonts
  doc.setFillColor(15, 23, 42) // Dark Slate primary
  doc.rect(0, 0, 210, 40, 'F')
  
  // Title Header
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('UJ3DMap ROUTE GUIDE', 15, 20)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()} | University of Jos, Nigeria`, 15, 30)

  // Route Summary Details
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Route Details', 15, 55)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`From: ${startName || 'My Live Location'}`, 15, 65)
  doc.text(`To: ${endName}`, 15, 72)
  doc.text(`Mode of Transit: ${mode.toUpperCase()}`, 15, 79)
  doc.text(`Distance: ${(route.distance / 1000).toFixed(2)} km | Est. Duration: ${Math.round(route.distance / 1.4 / 60)} min`, 15, 86)

  // Draw Route Map Schematic Vector directly in PDF!
  doc.setDrawColor(226, 232, 240)
  doc.setFillColor(248, 250, 252)
  doc.rect(120, 50, 75, 50, 'FD') // Map border box
  
  // Draw bounding text inside map schematic
  doc.setFontSize(9)
  doc.setTextColor(148, 163, 184)
  doc.text('Route Vector Path Map', 123, 55)

  if (route.coordinates && route.coordinates.length > 0) {
    // Project coordinates to fit inside the 75x50 PDF box
    const lats = route.coordinates.map(c => c[0])
    const lngs = route.coordinates.map(c => c[1])
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    
    const latSpan = maxLat - minLat || 0.0001
    const lngSpan = maxLng - minLng || 0.0001

    // Map box coordinate targets
    const xMin = 125
    const xMax = 190
    const yMin = 95 // PDF Y coordinates go top-to-bottom
    const yMax = 60

    const project = (lat, lng) => {
      // Map longitude to X
      const x = xMin + ((lng - minLng) / lngSpan) * (xMax - xMin)
      // Map latitude to Y (invert so higher lat is higher on PDF)
      const y = yMin - ((lat - minLat) / latSpan) * (yMin - yMax)
      return { x, y }
    }

    doc.setLineWidth(1)
    doc.setDrawColor(16, 185, 129) // Emerald route color
    
    // Draw route lines
    for (let i = 0; i < route.coordinates.length - 1; i++) {
      const p1 = project(route.coordinates[i][0], route.coordinates[i][1])
      const p2 = project(route.coordinates[i + 1][0], route.coordinates[i + 1][1])
      doc.line(p1.x, p1.y, p2.x, p2.y)
    }

    // Draw start marker dot (Blue)
    const startPt = project(route.coordinates[0][0], route.coordinates[0][1])
    doc.setFillColor(59, 130, 246)
    doc.circle(startPt.x, startPt.y, 1.5, 'FD')

    // Draw end marker dot (Red)
    const endPt = project(route.coordinates[route.coordinates.length - 1][0], route.coordinates[route.coordinates.length - 1][1])
    doc.setFillColor(239, 68, 68)
    doc.circle(endPt.x, endPt.y, 1.5, 'FD')
  }

  // Divider
  doc.setLineWidth(0.5)
  doc.setDrawColor(226, 232, 240)
  doc.line(15, 108, 195, 108)

  // Step-by-Step Directions
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Navigation Steps', 15, 118)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  let yOffset = 128
  route.steps.forEach((step, index) => {
    // Page overflow handler
    if (yOffset > 275) {
      doc.addPage()
      yOffset = 20
    }
    
    const formattedStep = `${index + 1}. ${step}`
    // Auto-wrap text lines if they exceed page width
    const textLines = doc.splitTextToSize(formattedStep, 180)
    
    textLines.forEach(line => {
      doc.text(line, 15, yOffset)
      yOffset += 7
    })
  })

  // Save PDF file
  const filename = `UJ3DMap_Route_${endName.replace(/\s+/g, '_')}.pdf`
  doc.save(filename)
}
