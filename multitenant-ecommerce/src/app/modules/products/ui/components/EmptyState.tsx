interface EmptyStateProps {
    message?: string;
}

export const EmptyState = ({ message = "No products found." }: EmptyStateProps) => {
    return (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
            {message}
        </div>
    );
};
