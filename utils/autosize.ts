const autosize = (target: HTMLTextAreaElement): void => {
  target.style.height = "initial";
  target.style.height = +target.scrollHeight + "px";
};

export default autosize;
