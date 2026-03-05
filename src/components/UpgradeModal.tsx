import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/pricing");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md brutalist-border">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-primary/10 brutalist-border rounded-2xl flex items-center justify-center mb-3">
            <Crown size={32} className="text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Unlock Premium Content
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Upgrade to Pro to access HSK 3–6 lessons and full mock tests.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Sparkles size={18} className="text-primary shrink-0" />
            <span className="text-sm">HSK 3–6 Full Course Access</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Sparkles size={18} className="text-primary shrink-0" />
            <span className="text-sm">Complete Mock Test Exams</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Sparkles size={18} className="text-primary shrink-0" />
            <span className="text-sm">Advanced Exercises & Practice</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Sparkles size={18} className="text-primary shrink-0" />
            <span className="text-sm">Full Progress Tracking</span>
          </div>
        </div>

        <Button
          className="w-full h-12 text-lg font-bold brutalist-border"
          onClick={handleUpgrade}
        >
          <Crown size={18} className="mr-2" />
          Upgrade to Pro
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Contact admin to upgrade your account.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
