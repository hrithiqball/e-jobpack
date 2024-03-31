import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

type QrCodeGeneratorProps = {
  open: boolean;
  onClose: () => void;
  assetId: string;
};

export default function QrCodeGenerator({
  open,
  onClose,
  assetId,
}: QrCodeGeneratorProps) {
  const url = `https://example.com/asset/${assetId}`;

  const [copied, setCopied] = useState(false);

  function handleCopyToClipboard() {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        console.log('Copied to clipboard', copied);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(error => {
        console.error('Error copying to clipboard:', error);
      });
  }

  function handleClose() {
    onClose();
  }

  function onImageDownload() {
    const svg = document.getElementById('QR-Code');

    if (!svg) {
      console.error('SVG element not found');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx?.drawImage(image, 0, 0);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'QRCode';
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    image.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4">
          <QRCode id="QR-Code" value={url} />
          <div className="flex w-full flex-1 flex-col items-center">
            <div className="flex w-full flex-1 items-center space-x-2">
              <Input readOnly value={url} className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyToClipboard}
              >
                <Copy size={18} />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onImageDownload}>Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
