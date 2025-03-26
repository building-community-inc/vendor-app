export const imageQueryString = `{
  "_id": asset -> _id,
  "url": asset -> url,
  "dimensions": asset -> metadata.dimensions {
    height,
    width,
    aspectRatio
  }
}
`;

export const marketQueryString = `
  _id,
  name,
  price,
  dates,
  "marketCover": marketCover ${imageQueryString},
  "venue": venue->{
    title,
    address,  
    city,
    tableInfo,
    hours,
    phone, 
    securityPhone,
    loadInInstructions,
  },
  lastDayToBook,
  "daysWithTables": daysWithTables[] {
    date,
    "tables": tables[] {
      "table": table {
        id,
        price
      },
      booked
    }
  },
  cancelled
`;

export const individualMarketQueryString = `
  _id,
  name,
  price,
  dates,
  archived,
  "marketCover": marketCover ${imageQueryString},
  "venue": venue->{
    title,
    address,  
    city,
    tableInfo,
    "venueMap": venueMap ${imageQueryString},
    hours,
    phone,
    securityPhone,
    loadInInstructions,
    vendorInstructions
  },
  lastDayToBook,
  "vendors": vendors[] {
    "vendor": vendor->{
      "_type": "reference",
      "_ref": _id,
      "businessName": business -> businessName,
      "businessCategory": business -> industry,
      "instagram": business -> instagramHandle,  
      email,
      firstName,
      lastName,
    },
    "datesBooked": datesBooked[] {
      date, 
      tableId,
    },
    specialRequests
  },
  "daysWithTables": daysWithTables[] {
    date,

    "tables": tables[] {
      "table": table {
        id, 
        price
      },
      "booked": booked -> {
        "_type": "reference",
        "_ref": _id,
        "businessName": business -> businessName,
        "businessCategory": business -> industry,
        "instagram": business -> instagramHandle,  
        email,
        firstName,
        lastName,
      }
    }
  },
  cancelled,
  vendorInstructions
`;
