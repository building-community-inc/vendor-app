import {
  Body,
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
  Tailwind,
  Text,
} from "@react-email/components";
import type * as React from "react";

export const BookingInfoEmail = ({
  bookingId,
  marketName,
  marketDates,
  bookedDays,
  subtotal,
  hst,
  total,
  hours,
  loadInInstructions,
  phone,
  venueAddress,
}: {
  bookingId: string;
  marketDates: string;
  marketName: string;
  bookedDays: {
    date: string;
    tableId: string;
    price: number;
  }[];
  subtotal: number;
  hst: number;
  total: number;
  loadInInstructions: string;
  phone: string;
  hours: string;
  venueAddress: string;
}) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body style={main}>
          <Preview>Booking Receipt</Preview>
          <Container className="mx-auto w-full max-w-full border border-gray-300">
            <Section className="px-10 py-5 bg-gray-100 w-full">
              <Row>
                <Column>
                  <Heading className="text-2xl md:text-4xl leading-relaxed font-bold text-center tracking-tighter">
                    Receipt
                  </Heading>
                  <Text className="m-0 leading-loose font-bold text-sm md:text-base">
                    Booking Id:
                  </Text>
                  <Text className="mt-2 font-medium leading-relaxed text-gray-500 text-xs">
                    {bookingId}
                  </Text>
                  <Row className="">
                    <Text>
                      To help you prepare for the event, we will be sending out
                      a vendor prep kit closer to the date. This kit will
                      include valuable social media graphics to promote your
                      participation, as well as comprehensive load-in details.
                    </Text>
                  </Row>
                </Column>
              </Row>
            </Section>
            <StyledHr />
            <Section className="px-18 py-10 text-center">
              <Img
                src={
                  "https://vendorapp.buildingcommunityinc.com/_next/image?url=%2Flogo-on-white-bg.png&w=1080&q=75"
                }
                className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] m-auto"
                // width="300"
                // height="300"
                alt="Building Community Inc. Logo"
                // style={{ margin: "auto" }}
              />
              <Text className="m-0 leading-loose text-gray-500 font-medium">
                {`${marketName} - ${marketDates}`}{" "}
              </Text>
            </Section>
            <StyledHr />

            <Section className="p-5 md:p-10 lg:p-[40px]">
              <Row>
                <Text
                  className="m-0 leading-loose text-sm font-bold text-center py-[10px]"
                  // style={{ ...title, textAlign: "center", padding: "10px 0" }}
                >
                  Booking Details
                </Text>
              </Row>
              <Row className="m-0 leading-loose text-black text-sm font-bold text-center">
                <Column className="w-[33%]">Date</Column>
                <Column className="w-[33%]">Table</Column>
                <Column className="w-[33%]">Price</Column>
              </Row>
              {bookedDays.map((day) => (
                <Row className="m-0 leading-loose text-black text-sm text-center">
                  <Column className="w-[33%] text-xs md:text-sm lg:text-base">
                    {day.date}
                  </Column>
                  <Column className="w-[33%] text-xs md:text-sm lg:text-base">
                    {day.tableId}
                  </Column>
                  <Column className="w-[33%] text-xs md:text-sm lg:text-base">
                    ${day.price}
                  </Column>
                </Row>
              ))}
            </Section>
            <StyledHr />
            <Section className="p-5 md:p-10 lg:p-[40px]">
              <Row
                style={{
                  // display: "inline-flex",
                  // marginBottom: 40,
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Column className="m-0 leading-loose text-black text-sm flex">
                  <div style={{}}>
                    <Text style={{ ...title }}>Totals:</Text>
                    <Text>
                      <strong>Subtotal:</strong> ${subtotal}
                    </Text>
                    <Text>
                      <strong>HST:</strong> ${hst}
                    </Text>
                    <Text>
                      <strong>Total:</strong> ${total}
                    </Text>
                  </div>
                </Column>
              </Row>
            </Section>

            <StyledHr />
            <Section style={menu.container}>
              <Row>
                <Text style={menu.title}>Venue Details</Text>
              </Row>
              <Row style={menu.content}>
                <Column>
                  <Text>
                    <strong>Name:</strong>
                  </Text>
                  <Text>{marketName}</Text>
                  <Text>
                    <strong>Address:</strong>
                  </Text>
                  <Text>{venueAddress}</Text>
                  <Text>
                    <strong>Hours:</strong>
                  </Text>
                  <Text>{hours}</Text>
                  <Text>
                    <strong>Phone:</strong>
                  </Text>
                  <Text>{phone}</Text>
                  <Text>
                    <strong>Load In Instructions:</strong>
                  </Text>
                  <Text>{loadInInstructions}</Text>
                </Column>
              </Row>
            </Section>
            <StyledHr />
            <Section>
              <Row>
                <Link
                  className="py-10"
                  href="https://vendorapp.buildingcommunityinc.com/terms-and-conditions"
                >
                  Terms and Conditions
                </Link>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

const BookingInfoEmailPreview = () => {
  return (
    <BookingInfoEmail
      bookingId="0982u3erkjwnsefksedjfn"
      marketName="Vaugn Mills (Market Court) = Le March'e"
      marketDates="March 14-16, 2025"
      bookedDays={[
        {
          date: "14-03-2025",
          price: 250,
          tableId: "10",
        },
        {
          date: "15-03-2025",
          price: 250,
          tableId: "10",
        },
        {
          date: "16-03-2025",
          price: 250,
          tableId: "10",
        },
      ]}
      subtotal={750}
      hst={750 * 0.13}
      total={750 + 750 * 0.13}
      hours="Monday to Saturday 10:00AM - 9:00PM & Sunday: 11:00AM - 7:00PM"
      phone="General Information: 905-879-2110 Security: 905-879-2111"
      loadInInstructions="Entrance 3, Event Court (Across from Aroma)"
      venueAddress="1 Bass Pro Mills Dr, Vaughan"
    />
  );
};

const StyledHr = () => <Hr className="border-gray-300 m-0" />;

export default BookingInfoEmailPreview;
const paddingY = {
  paddingTop: "22px",
  paddingBottom: "22px",
};

const paragraph = {
  margin: "0",
  lineHeight: "2",
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const title = {
  ...paragraph,
  fontSize: "15px",
  fontWeight: "bold",
};

const menu = {
  container: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "20px",
    backgroundColor: "#F7F7F7",
  },
  content: {
    ...paddingY,
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  title: {
    paddingLeft: "20px",
    paddingRight: "20px",
    fontWeight: "bold",
  },
  text: {
    fontSize: "13.5px",
    marginTop: 0,
    fontWeight: 500,
    color: "#000",
  },
  tel: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "32px",
    paddingBottom: "22px",
  },
};
