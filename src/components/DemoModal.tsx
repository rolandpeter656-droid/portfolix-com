import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal = ({ isOpen, onClose }: DemoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            PortfoliX Demo
          </DialogTitle>
        </DialogHeader>
        
        <div className="aspect-video w-full">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/Hir6wfzeKKo" 
            frameBorder="0" 
            allow="autoplay; fullscreen" 
            allowFullScreen
            className="rounded-lg"
          />
        </div>
        
        <DialogDescription className="text-center text-lg text-muted-foreground mt-4">
          Institutional-grade strategies, simplified for every investor.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};