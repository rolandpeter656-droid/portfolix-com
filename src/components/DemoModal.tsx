import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal = ({ isOpen, onClose }: DemoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold">
            PortfoliX Demo
          </DialogTitle>
        </DialogHeader>
        
        <div className="aspect-video w-full">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/Ct1YHi9yfxs" 
            frameBorder="0" 
            allow="autoplay; fullscreen" 
            allowFullScreen
            className="rounded-lg"
          />
        </div>
        
        <DialogDescription className="text-center text-sm sm:text-base md:text-lg text-muted-foreground mt-3 sm:mt-4">
          Professional strategies, simplified for every investor.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
