"use client"
import { setMessageAsRead } from "./actions";
import { useEffect, useRef } from "react";

const OpenBody = ({ body, messageId, userId, isMessageRead }: {
  body: string;
  messageId: string;
  userId: string;
  isMessageRead: boolean;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  // console.log({ body })

  useEffect(() => {
    // setMessageAsRead(formRef.current);
    if (!isMessageRead) {
      formRef.current?.requestSubmit();
    }
  }, [])
  return (
    <form ref={formRef} action={setMessageAsRead}>
      <input type="hidden" name="messageId" value={messageId} />
      <input type="hidden" name="userId" value={userId} />
      {/* <Dropdown title="Body" theme="dark"
      > */}
      <span className="">
        {body}
      </span>
      {/* </Dropdown> */}
    </form >
  );
}

export default OpenBody;