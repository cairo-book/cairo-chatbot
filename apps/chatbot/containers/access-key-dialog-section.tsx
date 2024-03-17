'use client'

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import toast from "react-hot-toast";
import { ValidateKeyUtils } from "@repo/ai/utils/validateKey.utils";

export interface AccessKeyDialogSectionProps extends React.ComponentProps<'div'> {
  previewToken: string | null
  setPreviewToken: (value: string) => void
  previewTokenDialog: boolean
  setPreviewTokenDialog: (value: boolean) => void
}

export function AccessKeyDialogSection({
    previewToken,
    setPreviewToken,
    previewTokenDialog,
    setPreviewTokenDialog
}: AccessKeyDialogSectionProps) {
    const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')

    const submitAccessKey = () => {
        if (ValidateKeyUtils.isKeyValid(previewTokenInput)) {
            setPreviewToken(previewTokenInput);
            setPreviewTokenDialog(false);
        } else {
            toast.error('Access key is not valid. Please try again.');
        }
    };

    return (
      <Dialog open={previewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your Access Key</DialogTitle>
            <DialogDescription>
              This site is still a work in progress. 
              You should have an access key to access it in preview.
              If you have not obtained your key, you can do so by contact us{' '}
              <a
                href="https://github.com/cairo-book"
                className="underline"
              >
                visit us. 
              </a>{' '}
              This is only necessary for preview
              environments so that the open source community can test the app.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="Access key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={submitAccessKey}
            >
              Save Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}
