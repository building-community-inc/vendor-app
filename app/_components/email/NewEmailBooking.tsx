import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'; import * as React from "react";


export const BookingCreatedEmail = ({ vendorName, vendorLogoUrl, bookingUrl }: {
  vendorName: string;
  vendorLogoUrl?: string;
  bookingUrl: string;
}) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>{`New Booking from ${vendorName}`}</Preview>
        <Container style={container}>
          <Section>
            <Img
              src={`https://vendorapp.buildingcommunityinc.com/_next/image?url=%2Flogo-on-white-bg.png&w=640&q=75`}
              width="150"
              height="150"
              alt="Vendor App Logo"
            />
          </Section>
          {vendorLogoUrl && (

            <Section>
              <Img
                src={vendorLogoUrl}
                width="96"
                height="96"
                alt={vendorName}
                style={userImage}
              />
            </Section>
          )}
          <Section style={{ paddingBottom: '20px' }}>
            <Row>
              <Text style={heading}>Booking from {vendorName}</Text>
              <Button style={button} href={bookingUrl}>
                Review Booking Details
              </Button>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  )
};


const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%',
};

const userImage = {
  margin: '0 auto',
  marginBottom: '16px',
  borderRadius: '50%',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
};

// const paragraph = {
//   fontSize: '18px',
//   lineHeight: '1.4',
//   color: '#484848',
// };


const button = {
  backgroundColor: '#C5B5A4',
  borderRadius: '3px',
  color: '#000',
  fontSize: '18px',
  padding: '19px 30px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
};


export const ClientConfirmationEmail = ({
  // marketCoverUrl,
  // marketName,
  // vendorName,
  // marketDate,
  bookingUrl
}: {
  vendorName: string;
  marketName: string;
  marketCoverUrl: string;
  marketDate: string;
  bookingUrl: string;
}) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>
          Your booking has been confirmed
        </Preview>
        <Container style={clientContainer}>
          <Section style={message}>
            <Img
              src={`https://vendorapp.buildingcommunityinc.com/_next/image?url=%2Flogo-on-white-bg.png&w=640&q=75`}
              width="150"
              height="150"
              alt="Vendor App Logo"
              style={{ margin: 'auto' }}
            />

            <Heading style={global.heading}>Your Booking has been confirmed.</Heading>
            <Text style={global.text}>
              Your booking has been confirmed use the link below to review the details.
            </Text>
            <Row>
              <Button style={button} href={bookingUrl}>
                Review Booking Details
              </Button>
            </Row>
          </Section>
          {/* <Hr style={global.hr} /> */}
          {/* <Section style={global.defaultPadding}>
            <Text style={adressTitle}>Confirmation for: {vendorName}</Text>
          </Section>
          <Hr style={global.hr} /> */}
          {/* <Section
            style={{ ...paddingX, paddingTop: '40px', paddingBottom: '40px' }}
          >
            <Row>
              <Img
                src={marketCoverUrl}
                alt={marketName}
                // style={{ float: 'left' }}
                width="100%"
              />
              <Row>
                <Text style={{ ...paragraph, fontWeight: '500' }}>
                  {marketName}
                </Text>
              </Row>
            </Row>
          </Section>
          <Hr style={global.hr} /> */}
          {/* <Section style={paddingY}> */}
          {/* </Section> */}
          <Hr style={global.hr} />
          <Section style={paddingY}>
            <Row>
              <Text style={footer.text}>
                {"© 2025 Building Community Inc.'s Vendor App."}              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>

  )
};

const paddingX = {
  paddingLeft: '40px',
  paddingRight: '40px',
};

const paddingY = {
  paddingTop: '22px',
  paddingBottom: '22px',
};

const paragraph = {
  margin: '0',
  lineHeight: '2',
};

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: 'bold' },
  heading: {
    fontSize: '32px',
    lineHeight: '1.3',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '-1px',
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: '#747474',
    fontWeight: '500',
  },
  button: {
    border: '1px solid #929292',
    fontSize: '16px',
    textDecoration: 'none',
    padding: '10px 0px',
    width: '220px',
    display: 'block',
    textAlign: 'center',
    fontWeight: 500,
    color: '#000',
  } as React.CSSProperties,
  hr: {
    borderColor: '#E5E5E5',
    margin: '0',
  },
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const clientContainer = {
  margin: '10px auto',
  width: '600px',
  maxWidth: '100%',
  border: '1px solid #E5E5E5',
};

const track = {
  container: {
    padding: '22px 40px',
    backgroundColor: '#F7F7F7',
  },
  number: {
    margin: '12px 0 0 0',
    fontWeight: 500,
    lineHeight: '1.4',
    color: '#6F6F6F',
  },
};

const message = {
  padding: '40px 74px',
  textAlign: 'center',
} as React.CSSProperties;

const adressTitle = {
  ...paragraph,
  fontSize: '15px',
  fontWeight: 'bold',
};

const recomendationsText = {
  margin: '0',
  fontSize: '15px',
  lineHeight: '1',
  paddingLeft: '10px',
  paddingRight: '10px',
};

const recomendations = {
  container: {
    padding: '20px 0',
  },
  product: {
    verticalAlign: 'top',
    textAlign: 'left' as const,
    paddingLeft: '2px',
    paddingRight: '2px',
  },
  title: { ...recomendationsText, paddingTop: '12px', fontWeight: '500' },
  text: {
    ...recomendationsText,
    paddingTop: '4px',
    color: '#747474',
  },
};

const menu = {
  container: {
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '20px',
    backgroundColor: '#F7F7F7',
  },
  content: {
    ...paddingY,
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  title: {
    paddingLeft: '20px',
    paddingRight: '20px',
    fontWeight: 'bold',
  },
  text: {
    fontSize: '13.5px',
    marginTop: 0,
    fontWeight: 500,
    color: '#000',
  },
  tel: {
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '32px',
    paddingBottom: '22px',
  },
};

const categories = {
  container: {
    width: '370px',
    margin: 'auto',
    paddingTop: '12px',
  },
  text: {
    fontWeight: '500',
    color: '#000',
  },
};

const footer = {
  policy: {
    width: '166px',
    margin: 'auto',
  },
  text: {
    margin: '0',
    color: '#AFAFAF',
    fontSize: '13px',
    textAlign: 'center',
  } as React.CSSProperties,
};
