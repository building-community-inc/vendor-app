import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export const CancelledBookingEmail = () => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body style={main}>
          <Preview>Cancelled Booking</Preview>
          <Container className="mx-auto w-full max-w-full border border-gray-300">
            <Section className="px-10 py-5 md:px-20 lg:px-40 bg-gray-100 w-full">
              <Row>
                {/* <Column> */}
                <Heading className="text-base md:text-lg lg:text-2xl leading-relaxed font-bold text-center tracking-tighter">
                  Booking Cancelled
                </Heading>
                {/* </Column> */}
              </Row>
            </Section>
            <StyledHr />
            <Section className="px-10 py-5 md:px-20 lg:px-40">
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
              <Text className="my-5 leading-loose text-gray-500 ">
                Dear Vendor,
              </Text>
              <Text className="my-5 leading-loose text-gray-500 ">
                This message pertains to your recent table booking. We noted
                that payment was not received within the 24-hour window
                following your reservation. As per our policy, we have now
                cancelled this booking and released the table for other vendors.
              </Text>
              <Text className="my-5 leading-loose text-gray-500 ">
                If you still wish to proceed with this booking, you will need to
                log back into the vendor application. From there, please
                reselect your desired table and resubmit your payment via
                e-transfer within the next 24 hours.
              </Text>
              <Text className="my-5 leading-loose text-gray-500 ">
                We understand this may require your immediate attention. Please
                ensure the e-transfer is initiated promptly to secure your
                booking.
              </Text>
              <Text className="my-5 leading-loose text-gray-500 ">
                If you have any questions or require assistance, please do not
                hesitate to contact our support team.
              </Text>
              <Text className="my-5 leading-loose text-gray-500 ">
                Thank you for your understanding.
              </Text>
              <Text className="my-5 leading-loose text-gray-500 ">
                Sincerely,
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

const StyledHr = () => <Hr className="border-gray-300 m-0" />;

const CancelledBookingEmailPreview = () => {
  return <CancelledBookingEmail />;
};

export default CancelledBookingEmailPreview;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
