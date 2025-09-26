import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Flag } from 'lucide-react';
import ComplaintWizard from './ComplaintWizard';

const QuickReportButton = () => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowWizard(true)}
          size="lg"
          className="rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 bg-civic hover:bg-civic-accent text-white group"
        >
          <div className="flex flex-col items-center">
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            <Flag className="w-4 h-4 -mt-1" />
          </div>
        </Button>
        
        {/* Tooltip */}
        <div className="absolute -top-12 right-0 bg-foreground text-background px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Report Issue
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground"></div>
        </div>
      </div>

      {/* Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-background rounded-xl shadow-2xl">
              <div className="sticky top-0 bg-background border-b px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Flag className="w-5 h-5 text-civic" />
                    Report an Issue
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowWizard(false)}
                    className="hover:bg-muted"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <ComplaintWizard onClose={() => setShowWizard(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickReportButton;