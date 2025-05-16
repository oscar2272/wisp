import { ArrowLeft, HomeIcon, LoaderCircle } from "lucide-react";
import type { Route } from "./+types/otp-complete-page";
import {
  Form,
  Link,
  redirect,
  useNavigation,
  useSearchParams,
} from "react-router";
import { z } from "zod";
import { Button } from "~/common/components/ui/button";
import { makeSSRClient } from "~/supa-client";
import { Input } from "~/common/components/ui/input";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Verify OTP | wemake" }];
};

const formSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { data, success, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { fieldErrors: error.flatten().fieldErrors };
  }
  const { email, otp } = data;
  const { client, headers } = makeSSRClient(request);

  const { error: verifyError } = await client.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  });
  if (verifyError) {
    return { verifyError: verifyError.message };
  }
  return redirect("/", { headers });
};

export default function OtpPage({ actionData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant="ghost" className="absolute left-4 top-4" asChild>
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          HOME
        </Link>
      </Button>
      <div className="flex items-center flex-col justify-center w-full max-w-md gap-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Confirm OTP</h1>
          <p className="text-sm text-muted-foreground">
            Enter the OTP code sent to your email address.
          </p>
        </div>
        <Form className="w-full space-y-4" method="post">
          <Input
            name="email"
            defaultValue={email || ""}
            id="email"
            required
            type="email"
            placeholder="i.e wemake@example.com"
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-sm text-red-500">
              {actionData.fieldErrors?.email?.join(", ")}
            </p>
          )}
          <Input
            name="otp"
            id="otp"
            required
            type="number"
            placeholder="i.e 1234"
          />
          {actionData && "fieldErrors" in actionData && (
            <p className="text-sm text-red-500">
              {actionData.fieldErrors?.otp?.join(", ")}
            </p>
          )}
          {actionData && "verifyError" in actionData && (
            <p className="text-sm text-red-500">{actionData.verifyError}</p>
          )}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Verify OTP"
            )}
          </Button>
          <Button variant="secondary" className="w-full" asChild>
            <Link to="/auth/otp/start">Retry</Link>
          </Button>
        </Form>
      </div>
    </div>
  );
}
