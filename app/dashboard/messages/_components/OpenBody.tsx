"use client"
import Dropdown from "@/app/admin/dashboard/messages/_components/Dropdown";
import { setMessageAsRead } from "./actions";
import { useRef } from "react";

const OpenBody = ({ body, messageId, userId }: {
  body: string;
  messageId: string;
  userId: string;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={setMessageAsRead}>
      <input type="hidden" name="messageId" value={messageId} />
      <input type="hidden" name="userId" value={userId} />
      <Dropdown title="Body" theme="dark"
      >
        <span className="">
          {body}
        </span>
      </Dropdown>
    </form >
  );
}

export default OpenBody;