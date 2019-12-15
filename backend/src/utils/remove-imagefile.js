import fs from "fs";
import { join } from "path";

export default imagePath => {
  // deleta arquivos de imagens antigos quando estes forem atualizados na edicao do post.
  fs.unlink(join(__dirname, "..", "..", imagePath), error => {
    if (error) throw error;
  });
};
