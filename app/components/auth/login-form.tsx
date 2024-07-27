"use client";
import { useForm } from "react-hook-form";
import { CardWrapper } from "@/app/components/auth/card-wrapper";
import z from "zod";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { FormError } from "@/app/components/form-error";
import { FormSuccess } from "@/app/components/form-success";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Login } from "@/actions/login";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { db } from "@/lib/db";

export const LoginForm = () => {
  console.log();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        const loginResponse = await Login(values);
        if (loginResponse && loginResponse.error) {
          // form.reset();
          setError(loginResponse.error);
          return;
        }
        if (loginResponse && loginResponse.success) {
          // form.reset();
          setSuccess(loginResponse.success);
          return;
        }

        if (loginResponse?.twoFactor) {
          setShowTwoFactor(true);
          return;
        }

        const response = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        console.log(response);

        if (!response?.ok) {
          throw new Error(`${response?.error}`);
        }

        setSuccess("Login Successful");
        router.push("/settings");
      } catch (error: any) {
        console.log(error.message);
        console.log(error.message);
        console.log(error.message);
        console.log(error.message);
        if (error.message === "CredentialsSignin") {
          setError("Invalid Credentials");
        } else {
          setError("Something went wrong");
        }
      }
    });
  };

  return (
    <CardWrapper
      headerLabel='Welcome back'
      backButtonLabel="Don't have an account"
      backButtonHref='/auth/register'
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='space-y-4'>
            {showTwoFactor && (
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Two Factor Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='123456'
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='john.doe@example.com'
                            type='email'
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='********'
                            type='password'
                            disabled={isPending}
                          />
                        </FormControl>
                        <Button
                          size={"sm"}
                          variant={"link"}
                          className='px-0 font-normal'
                        >
                          <Link href={"/auth/reset"}>Forgot password?</Link>
                        </Button>
                        <FormMessage /> {/*zod message*/}
                      </FormItem>
                    );
                  }}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type='submit' className='w-full' disabled={isPending}>
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
