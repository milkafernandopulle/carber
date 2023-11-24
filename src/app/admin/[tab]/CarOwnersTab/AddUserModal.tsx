"use client";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextInputField from "@/components/atoms/forms/TextInputField";
import { createUser } from "./actions";
import { useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email(),
  password: z.string().min(8),
});

type FormSchema = z.infer<typeof formSchema>;

const defaultValues: FormSchema = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

type AddUserModalProps = {
  onChange: () => void;
};
export default function AddUserModal({ onChange }: AddUserModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleOpen = (open: boolean) => setIsModalOpen(open);

  const handleSubmit = form.handleSubmit(async (data) => {
    await createUser(data.firstName, data.lastName, data.email, data.password);
    handleOpen(false);
    onChange();
  });

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
        <div className="text-right mb-4">
          <Button variant="outline" onClick={() => handleOpen(true)}>
            Add Car Owner
          </Button>
        </div>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Driver</DialogTitle>
            <DialogDescription>Add a new driver to the system.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="">
                  <TextInputField name="firstName" label="First Name" />
                </div>
                <div className="">
                  <TextInputField name="lastName" label="Last Name" />
                </div>
                <div className="">
                  <TextInputField name="email" label="Email Address" />
                </div>
                <div className="">
                  <TextInputField type="password" name="password" label="Password" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
