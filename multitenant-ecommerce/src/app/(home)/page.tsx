import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";


export default function Home() {
    return (
      <div className="flex flex-col gap-y-4">
          <div>
              <Button variant="elevated" >
                  Test Button
              </Button>
          </div>
        <div>
            <Input placeholder="Input test" />
        </div>
          <div>
              <Input placeholder="Input test" />
          </div>
          <div>
              <Progress value={50}></Progress>
          </div>
          <div>
              <Textarea placeholder="Textarea"></Textarea>
          </div>
          <div>
              <Checkbox></Checkbox>
          </div>
      </div>
  )
}
