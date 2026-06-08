import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthLayout from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

interface FormValues {
  phone: string;
  password: string;
}

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    try {
      await login({ ...values, role: "admin" });
      toast({ title: "مرحباً بك في لوحة الإدارة" });
      navigate("/admin", { replace: true });
    } catch {
      toast({
        title: "فشل تسجيل الدخول",
        description: "تحقق من البيانات",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthLayout
      title="دخول الإدارة"
      subtitle="ادخل حسابك للوصول إلى لوحة التحكم"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <div>
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="01xxxxxxxxx"
            {...register("phone", { required: "رقم الهاتف مطلوب" })}
          />
          {errors.phone && (
            <p className="text-destructive text-sm mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password", { required: "كلمة المرور مطلوبة" })}
          />
          {errors.password && (
            <p className="text-destructive text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الدخول..." : "تسجيل الدخول"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link to="/" className="text-primary font-semibold hover:underline">
          العودة للرئيسية
        </Link>
      </p>
    </AuthLayout>
  );
}
