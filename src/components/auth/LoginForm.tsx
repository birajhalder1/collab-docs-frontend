"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import api from "@/services/api";

import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", data);
      if (response.data.success) {
        setAuth(response.data.data.user, response.data.data.accessToken);
        useAuthStore.getState().setAuth(response.data.data.user, response.data.data.accessToken);
        router.push("/dashboard");
        toast.success("Login successful!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" loading={loading} className="w-full">
        Login
      </Button>
      <p>
        New User ? <Link className="text-blue-500" href="/register">Sign Up</Link>
      </p>
    </form>
  );
}
