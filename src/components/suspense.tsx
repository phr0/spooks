import * as React from "react";
import { ErrorIndicator } from "./errorIndicator";
import { LoadingIndicator } from "./loadingIndicator";

interface ISuspenseProps<T> {
  promise: Array<Promise<T> | undefined>;
  loadingComponent?: JSX.Element;
  renderErrorComponent?: (errorCode?: number) => JSX.Element;
  children: React.ReactNode;
  silentReload?: boolean;
}

interface ISuspenseState {
  status?: "resolved" | "pending" | "error";
  errorCode?: number;
  alreadyLoaded?: boolean;
}

export class Suspense<T> extends React.Component<
  ISuspenseProps<T>,
  ISuspenseState
> {
  public state: ISuspenseState = {};

  public componentDidMount() {
    this.registerPromise();
  }

  public componentDidUpdate(prevProps: ISuspenseProps<T>) {
    const hasPromiseChanged = () => {
      if (prevProps.promise.length !== this.props.promise.length) {
        return true;
      }
      for (let index = 0; index < prevProps.promise.length; index++) {
        if (prevProps.promise[index] !== this.props.promise[index]) {
          return true;
        }
      }
      return false;
    };

    if (hasPromiseChanged()) {
      this.registerPromise();
    }
  }

  public render() {
    if (!this.props.promise || !this.state.status) {
      return null;
    }

    if (this.state.status === "error") {
      return this.props.renderErrorComponent ? (
        this.props.renderErrorComponent(this.state.errorCode)
      ) : (
        <ErrorIndicator />
      );
    }

    if (this.state.alreadyLoaded && this.props.silentReload) {
      return this.props.children;
    }

    if (this.state.status === "resolved") {
      return this.props.children;
    }

    if (this.state.status === "pending") {
      return this.props.loadingComponent || <LoadingIndicator />;
    }

    throw new Error("unknown suspense state");
  }

  private registerPromise = () => {
    const isAnyPromiseUndefined = this.props.promise.every(x => !x);

    if (isAnyPromiseUndefined) {
      return;
    }

    this.setState({ status: "pending" });

    Promise.all(this.props.promise as Array<Promise<any>>)
      .catch((response: any) => {
        if (response && response.status) {
          this.setState({ status: "error", errorCode: response.status });
        }
        throw response;
      })
      .then(() => {
        this.setState({
          status: "resolved",
          alreadyLoaded: true,
          errorCode: undefined
        });
      });
  };
}