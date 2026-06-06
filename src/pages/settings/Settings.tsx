import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Shield, Bell, Languages, UserCheck, ArrowLeft, Key } from "lucide-react";

export default function Settings() {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [lang, setLang] = useState("ar");

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمتا المرور الجديدتان غير متطابقتين",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "تم تحديث كلمة المرور",
      description: "تم تغيير كلمة مرور حسابك بنجاح.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePreferencesSave = () => {
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ تفضيلاتك الجديدة بنجاح.",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl text-right" dir="rtl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">الإعدادات</h1>
            <p className="text-sm text-muted-foreground">تعديل تفضيلات وخصوصية حسابك</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Menu Sidebar */}
          <div className="space-y-2">
            <Button
              variant="secondary"
              className="w-full justify-start text-right font-bold gap-2 text-xs"
              onClick={() => navigate("/settings")}
            >
              <Shield className="w-4 h-4 text-primary" />
              عام والأمان
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-right gap-2 text-xs"
              onClick={() => navigate("/settings/verification")}
            >
              <UserCheck className="w-4 h-4 text-muted-foreground" />
              توثيق الحساب (ID)
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-right gap-2 text-xs"
              onClick={() => navigate("/profile/" + user?.id)}
            >
              عرض ملفك الشخصي
            </Button>
          </div>

          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Bell className="w-4.5 h-4.5 text-primary" />
                  إعدادات التنبيهات
                </CardTitle>
                <CardDescription className="text-xs">تحكم في كيفية استلام الإشعارات ونداءات الاستغاثة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">إشعارات الهاتف (Push)</Label>
                    <p className="text-[10px] text-muted-foreground">عند استلام رسالة جديدة أو قبول التقديم.</p>
                  </div>
                  <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">تنبيهات البريد الإلكتروني</Label>
                    <p className="text-[10px] text-muted-foreground">ملخصات أسبوعية بالوظائف المعروضة.</p>
                  </div>
                  <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">تنبيهات الرسائل القصيرة (SMS)</Label>
                    <p className="text-[10px] text-muted-foreground">استلام نداءات SOS الطارئة بالقرب منك.</p>
                  </div>
                  <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
                </div>

                <Button onClick={handlePreferencesSave} className="w-full mt-2" size="sm">
                  حفظ تفضيلات التنبيهات
                </Button>
              </CardContent>
            </Card>

            {/* Language */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Languages className="w-4.5 h-4.5 text-primary" />
                  اللغة المفضلة (Language)
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-xs font-semibold">لغة عرض التطبيق</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={lang === "ar" ? "default" : "outline"}
                    onClick={() => setLang("ar")}
                  >
                    العربية
                  </Button>
                  <Button
                    size="sm"
                    variant={lang === "en" ? "default" : "outline"}
                    onClick={() => setLang("en")}
                  >
                    English
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Key className="w-4.5 h-4.5 text-primary" />
                  تغيير كلمة المرور
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">كلمة المرور الحالية</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">كلمة المرور الجديدة</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">تأكيد كلمة المرور الجديدة</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" size="sm" className="w-full mt-2">
                    تحديث كلمة المرور
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
