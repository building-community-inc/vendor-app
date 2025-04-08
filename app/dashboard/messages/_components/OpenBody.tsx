"use client"
import { setMessageAsRead } from "./actions";
import { useActionState, useEffect, useRef } from "react";

const OpenBody = ({ body, messageId, userId, isMessageRead }: {
  body: string;
  messageId: string;
  userId: string;
  isMessageRead: boolean;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  // console.log({ body })
  const [formState, formAction, isPending] = useActionState(
    setMessageAsRead,
    {
      success: false,
      errors: null
    });


  useEffect(() => {
    // setMessageAsRead(formRef.current);
    if (!isMessageRead) {
      formRef.current?.requestSubmit();
    }
  }, [])
  return (
    <form ref={formRef} action={formAction}>
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